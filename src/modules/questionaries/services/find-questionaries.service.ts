import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Questionary } from '../questionary.entity';

@Injectable()
export class FindQuestionariesService {
	constructor(
		@InjectRepository(Questionary)
		private questionariesRepository: Repository<Questionary>,
	) {}

	async execute(query?: string): Promise<Questionary[]> {
		const resolvedQuery = query ? `%${query}%` : '%%';
		let findQuestionaries: Questionary[];
		try {
			findQuestionaries = await this.questionariesRepository.find({
				where: {
					name: ILike(resolvedQuery),
				},
				order: {
					name: 'ASC',
				},
				relations: {
					companies: true,
					groupings: true,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the questionaries in the find-questionaries.service.ts',
				},
			);
		}

		return findQuestionaries;
	}
}
