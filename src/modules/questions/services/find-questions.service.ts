import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Question } from '../question.entity';

@Injectable()
export class FindQuestionsService {
	constructor(
		@InjectRepository(Question)
		private questionsRepository: Repository<Question>,
	) {}

	async execute(query?: string): Promise<Question[]> {
		const resolvedQuery = query ? `%${query}%` : '%%';
		let findQuestions: Question[];
		try {
			findQuestions = await this.questionsRepository.find({
				where: [
					{
						question: ILike(resolvedQuery),
					},
				],
				order: {
					question: 'ASC',
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

		return findQuestions;
	}
}
