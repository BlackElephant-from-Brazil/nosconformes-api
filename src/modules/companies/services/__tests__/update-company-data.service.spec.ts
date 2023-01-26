import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
	InternalServerErrorException,
	BadRequestException,
} from '@nestjs/common';
import { UpdateCompanyDataService } from '../update-company-data.service';
import { Company } from '../../companies.entity';

describe('UpdateCompanyDataService', () => {
	let updateCompanyDataService: UpdateCompanyDataService;
	let companiesRepository: Repository<Company>;

	beforeEach(async () => {
		const testingModule: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateCompanyDataService,
				{
					provide: getRepositoryToken(Company),
					useValue: {
						findOne: jest.fn().mockResolvedValue({
							id: '1',
							name: 'Test Company',
						}),
						save: jest.fn().mockResolvedValue(undefined),
					},
				},
			],
		}).compile();

		updateCompanyDataService = testingModule.get<UpdateCompanyDataService>(
			UpdateCompanyDataService,
		);
		companiesRepository = testingModule.get<Repository<Company>>(
			getRepositoryToken(Company),
		);
	});

	it('should be defined', () => {
		expect(updateCompanyDataService).toBeDefined();
	});

	it('should update company data', async () => {
		const result = await updateCompanyDataService.execute('1', {
			cnpj: '123456',
			logo: 'logo',
			name: 'Test Company Updated',
			site: 'test.com',
		});
		expect(companiesRepository.findOne).toBeCalledWith({
			where: { _eq: '1' },
		});
		expect(companiesRepository.save).toBeCalledWith({
			id: '1',
			name: 'Test Company Updated',
			site: 'test.com',
			cnpj: '123456',
			logo: 'logo',
		});
		expect(result).toEqual({
			id: '1',
			name: 'Test Company Updated',
			site: 'test.com',
			cnpj: '123456',
			logo: 'logo',
		});
	});

	it('should throw an InternalServerErrorException when an error occurs while trying to find the company', async () => {
		jest.spyOn(companiesRepository, 'findOne').mockRejectedValue(
			new Error(),
		);
		try {
			await updateCompanyDataService.execute('1', {
				cnpj: '123456',
				logo: 'logo',
				name: 'Test Company Updated',
				site: 'test.com',
			});
		} catch (e) {
			expect(e).toBeInstanceOf(InternalServerErrorException);
			expect(e.message).toBe(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
			);
			expect(e.options).toEqual({
				description:
					'This error occurred when trying to find the company in the update-company-data.service.ts',
			});
		}
	});

	it('should throw an BadRequestException when the company is not found', async () => {
		jest.spyOn(companiesRepository, 'findOne').mockResolvedValue(undefined);
		try {
			await updateCompanyDataService.execute('1', {
				cnpj: '123456',
				logo: 'logo',
				name: 'Test Company Updated',
				site: 'test.com',
			});
		} catch (e) {
			expect(e).toBeInstanceOf(BadRequestException);
			expect(e.message).toBe('A empresa informada é inválida.');
			expect(e.options).toEqual({
				description:
					'This error occurred trying to update the company data. Invalid companyId',
			});
		}
	});

	it('should throw an InternalServerErrorException when an error occurs while trying to save the company', async () => {
		jest.spyOn(companiesRepository, 'save').mockRejectedValue(new Error());
		try {
			await updateCompanyDataService.execute('1', {
				cnpj: '123456',
				logo: 'logo',
				name: 'Test Company Updated',
				site: 'test.com',
			});
		} catch (e) {
			expect(e).toBeInstanceOf(InternalServerErrorException);
			expect(e.message).toBe(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
			);
			expect(e.options).toEqual({
				description:
					'This error occurred when trying to save the company in the update-company-data.service.ts',
			});
		}
	});
});
