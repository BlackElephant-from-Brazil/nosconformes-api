import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/modules/companies/companies.entity';
import { User } from 'src/modules/users/users.entity';
import { ILike, In, Repository } from 'typeorm';

@Injectable()
export class FindAvailableCompaniesForAuditor {
	constructor(
		@InjectRepository(Company)
		private companiesRepository: Repository<Company>,
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async execute(auditorId: string, query = ''): Promise<Company[]> {
		let foundCompanies: Company[] = [];
		let foundAuditor: User;

		try {
			foundAuditor = await this.usersRepository.findOne({
				where: { _eq: auditorId },
				relations: {
					questionariesCompanies: {
						company: true,
						questionary: true,
					},
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'The error occurred when trying to find the auditor',
				},
			);
		}

		if (!foundAuditor) {
			throw new BadRequestException(
				'Você precisa estar logado com um usuário válido',
			);
		}

		if (foundAuditor.accessLevel === 'master') {
			try {
				foundCompanies = await this.companiesRepository.find({
					order: { name: 'asc' },
					where: { name: ILike(`%${query}%`) },
				});
			} catch (error) {
				throw new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description:
							'The error occurred when trying to find the company',
					},
				);
			}

			return foundCompanies;
		}

		try {
			const companies = await this.usersRepository
				.createQueryBuilder('users')
				.distinct()
				.select('questionariesCompanies.company_id', 'company_id')
				.leftJoin(
					'users.questionariesCompanies',
					'questionariesCompanies',
				)
				.where('users._eq = :auditorId', { auditorId })
				.getRawMany();

			const companiesIds: string[] = companies.map(
				(company) => company.company_id,
			);

			foundCompanies = await this.companiesRepository.find({
				where: { _eq: In(companiesIds), name: ILike(`%${query}%`) },
				order: { name: 'asc' },
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'The error occurred when trying to find the company',
				},
			);
		}

		return foundCompanies;
	}
}
