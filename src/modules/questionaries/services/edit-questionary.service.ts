import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EditQuestionaryDTO } from '../dtos/edit-questionary.dto';
import { Questionary } from '../questionary.entity';

@Injectable()
export class EditQuestionaryService {
	constructor(
		@InjectRepository(Questionary)
		private questionariesRepository: Repository<Questionary>,
	) {}

	async execute({
		name,
		questionaryId,
	}: EditQuestionaryDTO): Promise<Questionary> {
		let questionary: Questionary;
		try {
			questionary = await this.questionariesRepository.findOne({
				where: {
					_eq: questionaryId,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the questionary in the edit-questionary.service.ts',
				},
			);
		}

		if (!questionary) {
			throw new BadRequestException(
				'O questionário que você está tentando editar foi excluído ou não existe.',
			);
		}

		questionary.name = name;

		try {
			await this.questionariesRepository.save(questionary);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to save the questionary in the edit-questionary.service.ts',
				},
			);
		}

		return questionary;
	}
}
