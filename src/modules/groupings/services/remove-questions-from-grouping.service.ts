import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/modules/questions/question.entity';
import { Repository } from 'typeorm';
import { Grouping } from '../grouping.entity';

type RemoveQuestionsFromGroupingServiceParams = {
	groupingId: string;
	questionsIds: string[];
};

@Injectable()
export class RemoveQuestionsFromGroupingService {
	constructor(
		@InjectRepository(Grouping)
		private groupingsRepository: Repository<Grouping>,
		@InjectRepository(Question)
		private questionsRepository: Repository<Question>,
	) {}

	async execute({
		questionsIds,
		groupingId,
	}: RemoveQuestionsFromGroupingServiceParams): Promise<void> {
		let findGrouping: Grouping;
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

		findGrouping.questions = findGrouping.questions.filter(
			(question) => !questionsIds.includes(question.id),
		);

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
