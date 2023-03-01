import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Grouping } from '../grouping.entity';

@Injectable()
export class FindAllGroupingsService {
	constructor(
		@InjectRepository(Grouping)
		private groupingsRepository: Repository<Grouping>,
	) {}

	async execute(): Promise<Grouping[]> {
		let findGroupings: Grouping[];

		try {
			findGroupings = await this.groupingsRepository.find({
				where: {
					name: Not(''),
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente mais tarde ou contate o suporte.',
				{
					description:
						'Erro ao buscar agrupamentos no banco de dados.',
				},
			);
		}

		return findGroupings;
	}
}
