import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questionary } from '../questionary.entity';

type DeleteGroupingFromQuestionaryServiceParams = {
	questionaryId: string;
	groupingId: string;
};

@Injectable()
export class DeleteGroupingFromQuestionaryService {
	constructor(
		@InjectRepository(Questionary)
		private questionariesRepository: Repository<Questionary>,
	) {}

	async execute({
		questionaryId,
		groupingId,
	}: DeleteGroupingFromQuestionaryServiceParams): Promise<void> {
		let findQuestionary: Questionary;

		try {
			findQuestionary = await this.questionariesRepository.findOne({
				where: { _eq: questionaryId },
				relations: {
					groupings: true,
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

		findQuestionary.groupings = findQuestionary.groupings.filter(
			(grouping) => grouping._eq !== groupingId,
		);

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
	}
}
