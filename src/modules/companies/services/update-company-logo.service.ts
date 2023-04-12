import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies.entity';
import * as fs from 'fs';

@Injectable()
export class UpdateCompanyLogoService {
	constructor(
		@InjectRepository(Company)
		private companiesRepository: Repository<Company>,
	) {}

	async execute(companyId: string, logoPath: string): Promise<string> {
		let foundCompany: Company;
		try {
			foundCompany = await this.companiesRepository.findOne({
				where: {
					_eq: companyId,
				},
			});
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error while trying to get company by id',
				},
			);
		}

		if (!foundCompany) {
			throw new BadRequestException(
				'Não foi possível encontrar a empresa com o id informado.',
			);
		}

		if (foundCompany.logo) {
			const filename = foundCompany.logo.split('uploads/')[1];
			filename && fs.unlinkSync(`uploads/${filename}`);
		}

		foundCompany.logo = `${process.env.BASE_URL}:${
			process.env.PORT || 3333
		}/${logoPath}`;

		try {
			await this.companiesRepository.save(foundCompany);
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error while trying to save company',
				},
			);
		}

		return foundCompany.logo;
	}
}
