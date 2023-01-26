import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies.entity';

type UpdateCompanyData = {
	name: string;
	site: string;
	cnpj: string;
	logo: string;
};

@Injectable()
export class UpdateCompanyDataService {
	constructor(
		@InjectRepository(Company)
		private companiesRepository: Repository<Company>,
	) {}

	async execute(
		companyId: string,
		companyData: UpdateCompanyData,
	): Promise<Company> {
		let foundCompany: Company;

		try {
			foundCompany = await this.companiesRepository.findOne({
				where: {
					_eq: companyId,
				},
			});
		} catch (err) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the company in the update-company-data.service.ts',
				},
			);
		}

		if (!foundCompany)
			throw new BadRequestException('A empresa informada é inválida.', {
				description:
					'This error occurred trying to update the company data. Invalid companyId',
			});

		foundCompany.cnpj = companyData.cnpj;
		foundCompany.logo = companyData.logo;
		foundCompany.name = companyData.name;
		foundCompany.site = companyData.site;

		try {
			await this.companiesRepository.save(foundCompany);
		} catch (err) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to save the company in the update-company-data.service.ts',
				},
			);
		}

		return foundCompany;
	}
}
