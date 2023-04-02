import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/modules/companies/companies.entity';
import { Questionary } from 'src/modules/questionaries/questionary.entity';
import { User } from 'src/modules/users/users.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class FindAvailableQuestionariesForAuditor {
	constructor(
		@InjectRepository(Company)
		private companiesRepository: Repository<Company>,
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		@InjectRepository(Questionary)
		private questionariesRepository: Repository<Questionary>,
	) {}

	async execute(
		auditorId: string,
		companyId: string,
	): Promise<Questionary[]> {
		let foundQuestionaries: Questionary[] = [];
		let foundAuditor: User;
		let foundCompany: Company;

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

		try {
			foundCompany = await this.companiesRepository.findOne({
				where: { _eq: companyId },
				relations: {
					questionaries: {
						groupings: true,
					},
				},
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

		if (!foundCompany) {
			throw new BadRequestException(
				'Empresa informada está incorreta ou foi deletada.',
			);
		}

		if (foundAuditor.accessLevel === 'master') {
			foundQuestionaries = foundCompany.questionaries;

			return foundQuestionaries;
		}

		try {
			const questionaries = await this.companiesRepository
				.createQueryBuilder('companies')
				.distinct()
				.select(
					'questionariesCompanies.questionary_id',
					'questionary_id',
				)
				.leftJoin(
					'companies.questionariesCompanies',
					'questionariesCompanies',
				)
				.where('companies._eq = :companyId', { companyId })
				.getRawMany();

			const questionariesIds: string[] = questionaries.map(
				(questionary) => questionary.questionary_id,
			);

			foundQuestionaries = await this.questionariesRepository.find({
				where: { _eq: In(questionariesIds) },
				relations: {
					groupings: true,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'The error occurred when trying to find the questionaries',
				},
			);
		}

		return foundQuestionaries;
	}
}
