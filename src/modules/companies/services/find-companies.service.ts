import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Company } from '../companies.entity';

@Injectable()
export class FindCompaniesService {
	constructor(
		@InjectRepository(Company)
		private companiesRepository: Repository<Company>,
	) {}

	async execute(query?: string): Promise<Company[]> {
		const resolvedQuery = query ? `%${query}%` : '%%';
		let findCompanies: Company[];
		try {
			findCompanies = await this.companiesRepository.find({
				where: [
					{
						name: ILike(resolvedQuery),
					},
					{
						employees: {
							name: ILike(resolvedQuery),
						},
					},
				],
				relations: {
					auditors: true,
					employees: true,
				},
			});
		} catch (err) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor, tente novamente ou contate o suporte.',
			);
		}

		return findCompanies;
	}
}
