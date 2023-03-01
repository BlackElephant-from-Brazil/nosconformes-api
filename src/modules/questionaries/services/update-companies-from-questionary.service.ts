import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/modules/companies/companies.entity';
import { In, Not, Repository } from 'typeorm';
import { Questionary } from '../questionary.entity';

type UpdateCompaniesFromQuestionaryServiceParams = {
	questionaryId: string;
	companies: Company[];
};

@Injectable()
export class UpdateCompaniesFromQuestionaryService {
	constructor(
		@InjectRepository(Questionary)
		private questionariesRepository: Repository<Questionary>,
		@InjectRepository(Company)
		private companiesRepository: Repository<Company>,
	) {}

	async execute({
		questionaryId,
		companies,
	}: UpdateCompaniesFromQuestionaryServiceParams): Promise<Company[]> {
		let findQuestionary: Questionary;
		let availableCompanies: Company[];

		try {
			findQuestionary = await this.questionariesRepository.findOne({
				where: { _eq: questionaryId },
				relations: {
					companies: true,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error fetching questionary from database',
				},
			);
		}

		if (!findQuestionary) {
			throw new BadRequestException(
				'Não foi possível encontrar o questionário solicitado.',
			);
		}

		findQuestionary.companies = companies;

		try {
			await this.questionariesRepository.save(findQuestionary);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error saving questionary in database',
				},
			);
		}

		try {
			const companiesIds = findQuestionary.companies.map((c) => c._eq);
			availableCompanies = await this.companiesRepository.find({
				where: {
					_eq: Not(In(companiesIds)),
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error fetching companies from database',
				},
			);
		}

		return availableCompanies;
	}
}
