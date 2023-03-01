import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Grouping } from 'src/modules/groupings/grouping.entity';
import { In, Not, Repository } from 'typeorm';
import { Questionary } from '../questionary.entity';

type AddGroupingToQuestionaryServiceParams = {
	questionaryId: string;
	groupingId: string;
};

@Injectable()
export class AddGroupingToQuestionaryService {
	constructor(
		@InjectRepository(Questionary)
		private questionariesRepository: Repository<Questionary>,
		@InjectRepository(Grouping)
		private groupingsRepository: Repository<Grouping>,
	) {}

	async execute({
		groupingId,
		questionaryId,
	}: AddGroupingToQuestionaryServiceParams): Promise<void> {
		let findQuestionary: Questionary;
		let findGrouping: Grouping;

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
				'Ocorreu um erro interno no servidor. Por favor tente novamente mais tarde ou contate o suporte.',
				{
					description:
						'Erro ao buscar questionário no banco de dados.',
				},
			);
		}

		if (!findQuestionary) {
			throw new BadRequestException(
				'Não foi possível encontrar o questionário informado.',
			);
		}

		try {
			findGrouping = await this.groupingsRepository.findOne({
				where: {
					_eq: groupingId,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente mais tarde ou contate o suporte.',
				{
					description:
						'Erro ao buscar agrupamento no banco de dados.',
				},
			);
		}

		if (!findGrouping) {
			throw new BadRequestException(
				'Não foi possível encontrar o agrupamento informado.',
			);
		}

		findQuestionary.groupings.push(findGrouping);

		try {
			await this.questionariesRepository.save(findQuestionary);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente mais tarde ou contate o suporte.',
				{
					description:
						'Erro ao salvar questionário no banco de dados.',
				},
			);
		}
	}
}
