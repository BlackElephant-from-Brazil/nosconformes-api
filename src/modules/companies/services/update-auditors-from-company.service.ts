import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/users.entity';
import { In, Not, Repository } from 'typeorm';
import { Company } from '../companies.entity';

@Injectable()
export class UpdateAuditorsFromCompanyService {
	constructor(
		@InjectRepository(Company)
		private companiesRepository: Repository<Company>,
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async execute(companyId: string, auditors: User[]): Promise<User[]> {
		let company: Company;
		let availableAuditors: User[];

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

		if (!company) {
			throw new BadRequestException(
				'Não foi possível encontrar a empresa solicitada.',
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

		try {
			const auditorsIds = company.auditors.map((a) => a._eq);
			availableAuditors = await this.usersRepository.find({
				where: [
					{
						accessLevel: 'auditor',
						_eq: Not(In(auditorsIds)),
					},
					{
						accessLevel: 'master',
						_eq: Not(In(auditorsIds)),
					},
				],
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error fetching auditors from database',
				},
			);
		}

		return availableAuditors;
	}
}
