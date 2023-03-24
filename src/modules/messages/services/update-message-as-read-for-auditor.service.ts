import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../message.entity';

@Injectable()
export class UpdateMessageAsReadForAuditorService {
	constructor(
		@InjectRepository(Message)
		private messagesRepository: Repository<Message>,
	) {}

	async execute(questionId: string, companyId: string) {
		let messages: Message[];
		try {
			messages = await this.messagesRepository.find({
				where: {
					questionId,
					companyId,
					read: false,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the messages in the find-messages-from-question-from-company.service.ts',
				},
			);
		}

		messages.forEach(async (message) => {
			if (message.userId?.length > 0) return;
			message.read = true;
			try {
				await this.messagesRepository.save(message);
			} catch (error) {
				throw new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description:
							'This error occurred when trying to save the message in the find-messages-from-question-from-company.service.ts',
					},
				);
			}
		});
	}
}
