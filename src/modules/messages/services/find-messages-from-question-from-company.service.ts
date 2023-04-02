import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../message.entity';

@Injectable()
export class FindMessagesFromQuestionFromCompanyService {
	constructor(
		@InjectRepository(Message)
		private messagesRepository: Repository<Message>,
	) {}

	async execute(questionId: string, companyId: string): Promise<Message[]> {
		let messages: Message[];

		try {
			messages = await this.messagesRepository.find({
				where: {
					questionId,
					companyId,
				},
				relations: {
					user: true,
					employee: true,
				},
				order: {
					createdAt: 'ASC',
				},
			});
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the messages in the find-messages-from-question-from-company.service.ts',
				},
			);
		}

		return messages;
	}
}
