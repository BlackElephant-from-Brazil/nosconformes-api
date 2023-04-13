import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grouping } from '../grouping.entity';

type foundGroupingsDTO = {
	groupings: Grouping[];
	finishedGroupings: Grouping[];
};

@Injectable()
export class FindAllGroupingsFromQuestionaryForCompanyService {
	constructor(
		@InjectRepository(Grouping)
		private groupingsRepository: Repository<Grouping>,
	) {}

	async execute(
		questionaryId: string,
		companyId: string,
	): Promise<foundGroupingsDTO> {
		let foundGroupings: Grouping[];
		try {
			foundGroupings = await this.groupingsRepository.find({
				where: {
					questionaries: {
						_eq: questionaryId,
					},
				},
			});
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'Error while trying to get groupings by questionary id and company id in find-all-groupings-from-questionary-for-company.service.ts',
				},
			);
		}

		return {
			groupings: foundGroupings,
			finishedGroupings: [],
		};
	}
}
