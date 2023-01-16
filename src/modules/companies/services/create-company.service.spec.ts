import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType } from 'src/@types/mock.type';
import { repositoryMockFactory } from 'src/__mocks__/repository-mock.factory';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Company } from '../companies.entity';
import { CreateCompanyService } from './create-company.service';

describe('CreateCompanyService', () => {
	let createCompanyService: CreateCompanyService;
	let companiesMockRepository: MockType<Repository<Company>>;

	beforeEach(async () => {
		const companiesModuleRef = await Test.createTestingModule({
			providers: [
				CreateCompanyService,
				{
					provide: getRepositoryToken(Company),
					useFactory: repositoryMockFactory,
				},
			],
		}).compile();

		createCompanyService =
			companiesModuleRef.get<CreateCompanyService>(CreateCompanyService);
		companiesMockRepository = companiesModuleRef.get(
			getRepositoryToken(Company),
		);
	});

	it('should be able to create a new company', async () => {
		const company: Company = {
			_eq: v4(),
			logo: 'https://assets.b9.com.br/wp-content/uploads/2020/07/B.png',
			cnpj: '27777505000113',
			name: 'Casas Bahia',
			site: 'https://casasbahia.com.br/',
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		companiesMockRepository.create.mockReturnValue(company);
		companiesMockRepository.save.mockReturnValue(company);

		const createdCompany = await createCompanyService.execute({
			name: company.name,
			cnpj: company.cnpj,
			logo: company.logo,
			site: company.site,
		});

		expect(createdCompany).toHaveProperty('_eq');
		expect(createdCompany).toEqual(company);
		expect(companiesMockRepository.create).toHaveBeenCalledTimes(1);
		expect(companiesMockRepository.create).toHaveBeenCalledWith({
			name: company.name,
			cnpj: company.cnpj,
			logo: company.logo,
			site: company.site,
		});
		expect(companiesMockRepository.save).toHaveBeenCalledTimes(1);
		expect(companiesMockRepository.save).toHaveBeenCalledWith(company);
	});
});
