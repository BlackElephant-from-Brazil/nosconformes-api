import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Company } from '../companies.entity';
import { FindCompanyResp } from '../dtos/resp/find-company.resp.dto';

@Injectable()
export class FindCompaniesService {
	constructor(
		@InjectRepository(Company)
		private companiesRepository: Repository<Company>,
	) {}

	async execute(query?: string): Promise<FindCompanyResp[]> {
		const resolvedQuery = query ? `%${query}%` : '%%';
		const findCompanies = await this.companiesRepository.find({
			where: [
				{
					name: ILike(resolvedQuery),
				},
			],
		});

		// TODO: REMOVE MOCK
		const companies: FindCompanyResp[] = findCompanies.map((company) => {
			return {
				_eq: company._eq,
				logo: company.logo,
				name: company.name,
				auditors: [
					{
						_eq: 'id-auditor-1',
						name: 'Patrick Pessoa',
						photo:
							'https://cdn.vnda.com.br/cobogo/2021/10/29/19_10_3_309_site_autor_PatrickPessoa.jpg?v=1638557521',
					},
					{
						_eq: 'id-auditor-2',
						name: 'Raquel Ribeiro',
						photo:
							'https://www.arita.com.br/wp-content/uploads/2020/08/pessoa-expansiva-principais-caracteristicas-desta-personalidade.jpg',
					},
				],
			};
		});

		return companies;
	}
}
