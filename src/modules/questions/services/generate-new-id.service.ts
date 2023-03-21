import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Question } from '../question.entity';

@Injectable()
export class GenerateNewIdService {
	constructor(
		@InjectRepository(Question)
		private questionsRepository: Repository<Question>,
	) {}

	async execute(): Promise<string> {
		let quantityCreatedQuestionsToday: number;
		const today = new Date(); // criar um objeto Date com a data atual
		const startOfDay = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
		);
		const endOfDay = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate() + 1,
			0,
			0,
			-1,
		);

		try {
			quantityCreatedQuestionsToday =
				await this.questionsRepository.count({
					where: {
						createdAt: Between(startOfDay, endOfDay),
					},
				});
		} catch (err) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to count the questions created today in the create-question.service.ts',
				},
			);
		}

		const id = `ID NC${new Date().getFullYear().toString().slice(-2)}${(
			new Date().getMonth() + 1
		)
			.toString()
			.padStart(2, '0')}${new Date()
			.getDate()
			.toString()
			.padStart(2, '0')}-${(quantityCreatedQuestionsToday + 1)
			.toString()
			.padStart(4, '0')}`;

		return id;
	}
}
