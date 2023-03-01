import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Grouping } from 'src/modules/groupings/grouping.entity';
import { In, Not, Repository } from 'typeorm';
import { Questionary } from '../questionary.entity';

@Injectable()
export class FindAvailableGroupingsFromQuestionaryService {
	constructor(
		@InjectRepository(Questionary)
		private questionariesRepository: Repository<Questionary>,
		@InjectRepository(Grouping)
		private groupingsRepository: Repository<Grouping>,
	) {}

	async execute(questionaryId: string): Promise<Grouping[]> {
		let findQuestionary: Questionary;
		try {
			findQuestionary = await this.questionariesRepository.findOne({
				where: {
					_eq: questionaryId,
				},
				relations: {
					groupings: true,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Tente novamente mais tarde ou contate o suporte.',
				{
					description:
						'Erro ao buscar o questionário no banco de dados.',
				},
			);
		}

		if (!findQuestionary) {
			throw new BadRequestException('Questionário não encontrado.');
		}

		let availableGroupings: Grouping[];

		try {
			const unavailableGroupingIds = findQuestionary.groupings.map(
				(g) => g._eq,
			);
			availableGroupings = await this.groupingsRepository.find({
				where: {
					_eq: Not(In(unavailableGroupingIds)),
					name: Not(''),
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Tente novamente mais tarde ou contate o suporte.',
				{
					description:
						'Erro ao buscar os agrupamentos no banco de dados.',
				},
			);
		}

		return availableGroupings;
	}
}
