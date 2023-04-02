import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterMessageDTO } from '../dtos/register-message.dto';
import { Message } from '../message.entity';

@Injectable()
export class RegisterMessageService {
	constructor(
		@InjectRepository(Message)
		private messagesRepository: Repository<Message>,
	) {}

	async execute(registerMessageDTO: RegisterMessageDTO) {
		console.log(registerMessageDTO);
		const message = this.messagesRepository.create({
			...registerMessageDTO,
			read: false,
		});

		try {
			await this.messagesRepository.save(message);
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to save the message in the register-message.service.ts',
				},
			);
		}
	}
}
