import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grouping } from '../grouping.entity';

@Injectable()
export class FindGroupingByIdService {
	constructor(
		@InjectRepository(Grouping)
		private groupingsRepository: Repository<Grouping>,
	) {}

	async execute(groupingId: string): Promise<Grouping> {
		let findGrouping: Grouping;

		try {
			findGrouping = await this.groupingsRepository.findOne({
				where: {
					_eq: groupingId,
				},
				relations: {
					questions: {
						tags: true,
						references: true,
						answer: true,
					},
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

		const quantityQuestionsInGroupig = findGrouping.questions.length;
		const quantityAnsweredQuestions = findGrouping.questions.filter(
			(question) => question.answer,
		).length;

		findGrouping.percentage = Math.round(
			(quantityAnsweredQuestions / quantityQuestionsInGroupig) * 100,
		);

		return findGrouping;
	}
}
