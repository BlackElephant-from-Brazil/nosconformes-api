import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grouping } from '../grouping.entity';

type EditGroupingServiceParams = {
	groupingId: string;
	name: string;
};

@Injectable()
export class EditGroupingService {
	constructor(
		@InjectRepository(Grouping)
		private groupingsRepository: Repository<Grouping>,
	) {}

	async execute({
		name,
		groupingId,
	}: EditGroupingServiceParams): Promise<void> {
		let findGrouping: Grouping;
		try {
			findGrouping = await this.groupingsRepository.findOne({
				where: {
					_eq: groupingId,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Tente novamente mais tarde ou contate o suporte.',
				{
					description:
						'Erro ao buscar o agrupamento no banco de dados.',
				},
			);
		}

		if (!findGrouping) {
			throw new BadRequestException('Agrupamento não encontrado.');
		}

		findGrouping.name = name;

		try {
			await this.groupingsRepository.save(findGrouping);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Tente novamente mais tarde ou contate o suporte.',
				{
					description:
						'Erro ao salvar o agrupamento no banco de dados.',
				},
			);
		}
	}
}
