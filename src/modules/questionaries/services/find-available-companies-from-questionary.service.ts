import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/modules/companies/companies.entity';
import { In, Not, Repository } from 'typeorm';
import { Questionary } from '../questionary.entity';

@Injectable()
export class FindAvailableCompaniesFromQuestionaryService {
	constructor(
		@InjectRepository(Company)
		private companiesRepository: Repository<Company>,
		@InjectRepository(Questionary)
		private questionariesRepository: Repository<Questionary>,
	) {}

	async execute(questionaryId: string): Promise<Company[]> {
		let findCompanies: Company[];
		let findQuestionary: Questionary;

		try {
			findQuestionary = await this.questionariesRepository.findOne({
				where: {
					_eq: questionaryId,
				},
				relations: {
					companies: true,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the questionaries in the find-available-auditors-for-questionary.service.ts',
				},
			);
		}

		if (!findQuestionary) {
			throw new BadRequestException(
				'Não foi possível encontrar o questionário solicitado.',
			);
		}

		try {
			const companiesIds = findQuestionary.companies.map((c) => c._eq);
			findCompanies = await this.companiesRepository.find({
				where: {
					_eq: Not(In(companiesIds)),
				},
			});
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the companies in the find-available-companies-for-questionary.service.ts',
				},
			);
		}

		return findCompanies;
	}
}
