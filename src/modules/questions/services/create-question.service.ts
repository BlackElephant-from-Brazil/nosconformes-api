import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDTO } from '../dtos/create-question.dto';
import { Question } from '../question.entity';

@Injectable()
export class CreateQuestionService {
	constructor(
		@InjectRepository(Question)
		private questionsRepository: Repository<Question>,
	) {}

	async execute(createQuestionDTO: CreateQuestionDTO): Promise<Question> {
		const question = this.questionsRepository.create(createQuestionDTO);

		try {
			await this.questionsRepository.save(question);
		} catch (err) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to save the question in the create-question.service.ts',
				},
			);
		}

		return question;
	}
}
