import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questionary } from '../questionary.entity';

@Injectable()
export class FindQuestionaryByIdService {
	constructor(
		@InjectRepository(Questionary)
		private questionariesRepository: Repository<Questionary>,
	) {}

	async execute(questionaryId: string): Promise<Questionary> {
		let findQuestionary: Questionary;
		try {
			findQuestionary = await this.questionariesRepository.findOne({
				where: {
					_eq: questionaryId,
				},
				relations: {
					auditors: true,
					companies: true,
					groupings: true,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the questionaries in the find-questionary-by-id.service.ts',
				},
			);
		}

		return findQuestionary;
	}
}
