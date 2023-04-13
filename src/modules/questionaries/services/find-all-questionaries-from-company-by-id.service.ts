import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/modules/companies/companies.entity';
import { ILike, Repository } from 'typeorm';
import { Questionary } from '../questionary.entity';

@Injectable()
export class FindAllQuestionariesFromCompanyByIdService {
	constructor(
		@InjectRepository(Company)
		private companiesRepository: Repository<Company>,
		@InjectRepository(Questionary)
		private questionariesRepository: Repository<Questionary>,
	) {}

	async execute(companyId: string, query?: string): Promise<Questionary[]> {
		const resolvedQuery = query ? `%${query}%` : '%%';
		let foundCompany: Company;
		let foundQuestionaries: Questionary[];

		try {
			foundCompany = await this.companiesRepository.findOne({
				where: {
					_eq: companyId,
				},
			});
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'Error while trying to get company by id in find-all-questionaries-from-company-by-id.service.ts',
				},
			);
		}

		if (!foundCompany) {
			throw new BadRequestException('A empresa informada é inválida.');
		}

		try {
			foundQuestionaries = await this.questionariesRepository.find({
				where: {
					name: ILike(resolvedQuery),
					companies: {
						_eq: companyId,
					},
				},
				relations: {
					employees: true,
				},
			});
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'Error while trying to get questionaries by company id in find-all-questionaries-from-company-by-id.service.ts',
				},
			);
		}

		return foundQuestionaries;
	}
}
