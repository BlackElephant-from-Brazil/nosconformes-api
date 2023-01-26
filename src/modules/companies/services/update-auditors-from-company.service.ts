import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/users.entity';
import { Repository } from 'typeorm';
import { Company } from '../companies.entity';

@Injectable()
export class UpdateAuditorsFromCompanyService {
	constructor(
		@InjectRepository(Company)
		private companiesRepository: Repository<Company>,
	) {}

	async execute(companyId: string, auditors: User[]): Promise<Company> {
		let company: Company;
		try {
			company = await this.companiesRepository.findOne({
				where: { _eq: companyId },
				relations: ['auditors'],
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error fetching company from database',
				},
			);
		}

		company.auditors = auditors;

		try {
			await this.companiesRepository.save(company);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error saving company in database',
				},
			);
		}

		return company;
	}
}
