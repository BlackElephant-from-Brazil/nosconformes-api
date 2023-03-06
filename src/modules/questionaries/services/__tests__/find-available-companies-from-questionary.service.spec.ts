import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Company } from 'src/modules/companies/companies.entity';
import { FindAvailableCompaniesFromQuestionaryService } from '../find-available-companies-from-questionary.service';
import { Questionary } from '../../questionary.entity';
import { Test } from '@nestjs/testing';

describe('FindAvailableCompaniesFromQuestionaryService', () => {
	let service: FindAvailableCompaniesFromQuestionaryService;
	let questionariesRepository: jest.Mocked<
		Record<keyof Repository<Questionary>, jest.Mock>
	>;
	let companiesRepository: jest.Mocked<
		Record<keyof Repository<Company>, jest.Mock>
	>;

	beforeEach(async () => {
		questionariesRepository = {
			findOne: jest.fn(),
		} as any;
		companiesRepository = {
			find: jest.fn(),
		} as any;

		const module = await Test.createTestingModule({
			providers: [
				FindAvailableCompaniesFromQuestionaryService,
				{
					provide: getRepositoryToken(Questionary),
					useValue: questionariesRepository,
				},
				{
					provide: getRepositoryToken(Company),
					useValue: companiesRepository,
				},
			],
		}).compile();

		service = module.get<FindAvailableCompaniesFromQuestionaryService>(
			FindAvailableCompaniesFromQuestionaryService,
		);
	});

	describe('execute', () => {
		it('should return available companies', async () => {
			const questionary = new Questionary();
			questionary._eq = '1';
			questionary.companies = [
				{ _eq: '1', name: 'Company A' },
				{ _eq: '2', name: 'Company B' },
			] as Company[];
			const companies = [
				{ _eq: '3', name: 'Company C' },
				{ _eq: '4', name: 'Company D' },
			] as any;

			questionariesRepository.findOne.mockResolvedValue(questionary);
			companiesRepository.find.mockResolvedValue(companies);

			const result = await service.execute('1');

			expect(questionariesRepository.findOne).toHaveBeenCalledWith({
				where: { _eq: '1' },
				relations: { companies: true },
			});
			expect(companiesRepository.find).toHaveBeenCalledWith({
				where: { _eq: Not(In(['1', '2'])) },
			});
			expect(result).toEqual(companies);
		});

		it('should throw BadRequestException when questionary is not found', async () => {
			questionariesRepository.findOne.mockResolvedValue(undefined);

			await expect(service.execute('1')).rejects.toThrowError(
				new BadRequestException(
					'Não foi possível encontrar o questionário solicitado.',
				),
			);
		});

		it('should throw InternalServerErrorException when questionariesRepository throws error', async () => {
			questionariesRepository.findOne.mockRejectedValue(
				new Error('Database connection error'),
			);

			await expect(service.execute('1')).rejects.toThrowError(
				new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description:
							'This error occurred when trying to find the questionaries in the find-available-auditors-for-questionary.service.ts',
					},
				),
			);
		});

		it('should throw InternalServerErrorException when companiesRepository throws error', async () => {
			const questionary = new Questionary();
			questionary._eq = '1';
			questionary.companies = [
				{ _eq: '1', name: 'Company A' },
				{ _eq: '2', name: 'Company B' },
			] as any;

			questionariesRepository.findOne.mockResolvedValue(questionary);
			companiesRepository.find.mockRejectedValue(
				new Error('Database connection error'),
			);

			await expect(service.execute('1')).rejects.toThrowError(
				new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description:
							'This error occurred when trying to find the companies in the find-available-companies-for-questionary.service.ts',
					},
				),
			);
		});
	});
});
