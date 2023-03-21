import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Question } from '../question.entity';

type FindQuestionsResponse = {
	findQuestions: Question[];
	pageCount: number;
};

const ROW_LIMITER = 10;

@Injectable()
export class FindQuestionsService {
	constructor(
		@InjectRepository(Question)
		private questionsRepository: Repository<Question>,
	) {}

	async execute(
		page: number,
		query?: string,
	): Promise<FindQuestionsResponse> {
		const resolvedQuery = query ? `%${query}%` : '%%';
		const skip = (page - 1) * ROW_LIMITER;
		let findQuestions: Question[];
		let totalQuestions: number;
		try {
			[findQuestions, totalQuestions] =
				await this.questionsRepository.findAndCount({
					where: [
						{
							question: ILike(resolvedQuery),
						},
					],
					order: {
						question: 'ASC',
					},
					skip,
					take: ROW_LIMITER,
					relations: {
						tags: true,
						references: true,
						accordingButtons: true,
						partialAccordingButtons: true,
					},
				});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the question in the find-questions.service.ts',
				},
			);
		}

		return {
			findQuestions,
			pageCount: Math.ceil(totalQuestions / ROW_LIMITER),
		};
	}
}
