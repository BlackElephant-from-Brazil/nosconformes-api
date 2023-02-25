import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questionary } from '../questionary.entity';

@Injectable()
export class CreateQuestionaryService {
	constructor(
		@InjectRepository(Questionary)
		private questionariesRepository: Repository<Questionary>,
	) {}

	async execute(): Promise<string> {
		const questionary = this.questionariesRepository.create({
			name: '',
		});

		try {
			await this.questionariesRepository.save(questionary);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to save the questionary in the create-questionary.service.ts',
				},
			);
		}

		return questionary._eq;
	}
}
