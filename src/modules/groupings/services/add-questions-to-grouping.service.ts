import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/modules/questions/question.entity';
import { In, Repository } from 'typeorm';
import { Grouping } from '../grouping.entity';

type AddQuestionsToGroupingServiceParams = {
	groupingId: string;
	questionsIds: string[];
};

@Injectable()
export class AddQuestionsToGroupingService {
	constructor(
		@InjectRepository(Grouping)
		private groupingsRepository: Repository<Grouping>,
		@InjectRepository(Question)
		private questionsRepository: Repository<Question>,
	) {}

	async execute({
		questionsIds,
		groupingId,
	}: AddQuestionsToGroupingServiceParams): Promise<void> {
		let findGrouping: Grouping;
		let findQuestions: Question[];

		try {
			findGrouping = await this.groupingsRepository.findOne({
				where: {
					_eq: groupingId,
				},
				relations: {
					questions: true,
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

		try {
			findQuestions = await this.questionsRepository.find({
				where: {
					_eq: In(questionsIds),
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente mais tarde ou contate o suporte.',
				{
					description: 'Erro ao buscar questões no banco de dados.',
				},
			);
		}

		findGrouping.questions.push(...findQuestions);

		try {
			await this.groupingsRepository.save(findGrouping);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente mais tarde ou contate o suporte.',
				{
					description:
						'Erro ao salvar agrupamento no banco de dados.',
				},
			);
		}
	}
}
