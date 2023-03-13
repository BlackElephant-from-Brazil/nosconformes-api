import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../question.entity';

@Injectable()
export class FindQuestionByIdService {
	constructor(
		@InjectRepository(Question)
		private questionsRepository: Repository<Question>,
	) {}

	async execute(questionId: string): Promise<Question> {
		let question: Question;

		try {
			question = await this.questionsRepository.findOne({
				where: {
					_eq: questionId,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the question in the find-question-by-id.service.ts',
				},
			);
		}

		return question;
	}
}
