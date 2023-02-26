import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/modules/companies/companies.entity';
import { Repository } from 'typeorm';
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
	) {}

	async execute({
		questionaryId,
		companies,
	}: UpdateCompaniesFromQuestionaryServiceParams): Promise<Questionary> {
		let findQuestionary: Questionary;

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

		return findQuestionary;
	}
}
