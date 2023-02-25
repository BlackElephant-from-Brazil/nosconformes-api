import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Questionary } from 'src/modules/questionaries/questionary.entity';
import { Repository } from 'typeorm';
import { CreateGroupingDTO } from '../dtos/create-grouping.dto';
import { Grouping } from '../grouping.entity';

@Injectable()
export class CreateGroupingService {
	constructor(
		@InjectRepository(Grouping)
		private groupingsRepository: Repository<Grouping>,
		@InjectRepository(Questionary)
		private questionariesRepository: Repository<Questionary>,
	) {}

	async execute({ questionaryId }: CreateGroupingDTO): Promise<string> {
		const grouping = this.groupingsRepository.create({
			name: '',
		});

		try {
			await this.groupingsRepository.save(grouping);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to save the grouping in the create-grouping.service.ts',
				},
			);
		}

		let questionary: Questionary;
		try {
			questionary = await this.questionariesRepository.findOne({
				where: {
					_eq: questionaryId,
				},
				relations: {
					groupings: true,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the questionary in the create-grouping.service.ts',
				},
			);
		}
		questionary.groupings.push(grouping);

		try {
			await this.questionariesRepository.save(questionary);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to save the questionary in the create-grouping.service.ts',
				},
			);
		}

		return grouping._eq;
	}
}
