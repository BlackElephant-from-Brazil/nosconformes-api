import { Test } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { FindAllCompaniesService } from '../find-all-companies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from '../../companies.entity';
import { ILike, Repository } from 'typeorm';

describe('FindCompaniesService', () => {
	let findCompaniesService: FindAllCompaniesService;
	let companiesRepository: Repository<Company>;

	beforeEach(async () => {
		const testingModule = await Test.createTestingModule({
			providers: [
				FindAllCompaniesService,
				{
					provide: getRepositoryToken(Company),
					useValue: {
						find: jest.fn(),
					},
				},
			],
		}).compile();

		findCompaniesService = testingModule.get<FindAllCompaniesService>(
			FindAllCompaniesService,
		);
		companiesRepository = testingModule.get<Repository<Company>>(
			getRepositoryToken(Company),
		);
	});

	describe('execute', () => {
		it('should return an array of companies', async () => {
			const query = 'Acme';
			const companies = [{ id: '1', name: 'Acme Inc.' }];
			(companiesRepository.find as jest.Mock).mockResolvedValue(
				companies,
			);

			const result = await findCompaniesService.execute(query);

			expect(result).toEqual(companies);
			expect(companiesRepository.find).toHaveBeenCalledWith({
				where: [
					{
						name: ILike('%Acme%'),
					},
					{
						employees: {
							name: ILike('%Acme%'),
						},
					},
				],
				relations: {
					auditors: true,
					employees: true,
				},
			});
		});

		it('should return an array of companies when query is not passed', async () => {
			const companies = [{ id: '1', name: 'Acme Inc.' }];
			(companiesRepository.find as jest.Mock).mockResolvedValue(
				companies,
			);

			const result = await findCompaniesService.execute();

			expect(result).toEqual(companies);
			expect(companiesRepository.find).toHaveBeenCalledWith({
				where: [
					{ name: ILike('%%') },
					{ employees: { name: ILike('%%') } },
				],
				relations: { auditors: true, employees: true },
			});
		});

		it('should throw an InternalServerErrorException when there is an error', async () => {
			(companiesRepository.find as jest.Mock).mockRejectedValue(
				new Error(),
			);

			try {
				await findCompaniesService.execute();
			} catch (err) {
				expect(err).toBeInstanceOf(InternalServerErrorException);
				expect(err.message).toBe(
					'Ocorreu um erro interno no servidor. Por favor, tente novamente ou contate o suporte.',
				);
			}
		});
	});
});
