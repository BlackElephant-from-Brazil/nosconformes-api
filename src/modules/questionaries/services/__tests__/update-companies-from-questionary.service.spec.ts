import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from 'src/modules/companies/companies.entity';
import { Repository } from 'typeorm';
import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { UpdateCompaniesFromQuestionaryService } from '../update-companies-from-questionary.service';
import { Questionary } from '../../questionary.entity';

describe('UpdateCompaniesFromQuestionaryService', () => {
	let service: UpdateCompaniesFromQuestionaryService;
	let questionariesRepository: Repository<Questionary>;
	let companiesRepository: Repository<Company>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateCompaniesFromQuestionaryService,
				{
					provide: getRepositoryToken(Questionary),
					useClass: Repository,
				},
				{
					provide: getRepositoryToken(Company),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<UpdateCompaniesFromQuestionaryService>(
			UpdateCompaniesFromQuestionaryService,
		);
		questionariesRepository = module.get<Repository<Questionary>>(
			getRepositoryToken(Questionary),
		);
		companiesRepository = module.get<Repository<Company>>(
			getRepositoryToken(Company),
		);
	});

	describe('execute', () => {
		it('should throw BadRequestException when questionary is not found', async () => {
			jest.spyOn(questionariesRepository, 'findOne').mockReturnValueOnce(
				undefined,
			);

			await expect(
				service.execute({
					questionaryId: 'invalid_id',
					companies: [],
				}),
			).rejects.toThrow(BadRequestException);
		});

		it('should throw InternalServerErrorException when questionary cannot be fetched from database', async () => {
			jest.spyOn(
				questionariesRepository,
				'findOne',
			).mockRejectedValueOnce(new Error('Database error'));

			await expect(
				service.execute({
					questionaryId: 'valid_id',
					companies: [],
				}),
			).rejects.toThrow(InternalServerErrorException);
		});

		it('should save the questionary with the updated companies', async () => {
			const findQuestionary = {
				_eq: 'valid_id',
				companies: [],
			} as Questionary;
			const updatedQuestionary = {
				_eq: 'valid_id',
				companies: [{ _eq: 'company1' } as Company],
			} as Questionary;

			jest.spyOn(
				questionariesRepository,
				'findOne',
			).mockResolvedValueOnce(findQuestionary);

			jest.spyOn(questionariesRepository, 'save').mockResolvedValueOnce(
				updatedQuestionary,
			);

			jest.spyOn(companiesRepository, 'find').mockResolvedValueOnce([
				{ _eq: 'company1' },
			] as Company[]);

			const result = await service.execute({
				questionaryId: 'valid_id',
				companies: [{ _eq: 'company1' } as Company],
			});

			expect(questionariesRepository.findOne).toHaveBeenCalledWith({
				where: { _eq: 'valid_id' },
				relations: {
					companies: true,
				},
			});
			expect(questionariesRepository.save).toHaveBeenCalledWith(
				updatedQuestionary,
			);
			expect(result).toEqual([{ _eq: 'company1' }] as Company[]);
		});

		it('should throw InternalServerErrorException when questionary cannot be saved in the database', async () => {
			const findQuestionary = {
				_eq: 'valid_id',
				companies: [],
			} as Questionary;
			jest.spyOn(
				questionariesRepository,
				'findOne',
			).mockResolvedValueOnce(findQuestionary);
			jest.spyOn(questionariesRepository, 'save').mockRejectedValueOnce(
				new Error('Database error'),
			);

			await expect(
				service.execute({
					questionaryId: 'valid_id',
					companies: [{ _eq: 'company1' } as Company],
				}),
			).rejects.toThrow(InternalServerErrorException);
		});

		it('should throw a InternalServerErrorException when the companies cannot be fetched from the database', async () => {
			const findQuestionary = {
				_eq: 'valid_id',
				companies: [],
			} as Questionary;
			jest.spyOn(
				questionariesRepository,
				'findOne',
			).mockResolvedValueOnce(findQuestionary);
			jest.spyOn(questionariesRepository, 'save').mockResolvedValueOnce(
				findQuestionary,
			);
			jest.spyOn(companiesRepository, 'find').mockRejectedValueOnce(
				new Error(),
			);

			await expect(
				service.execute({
					questionaryId: 'valid_id',
					companies: [{ _eq: 'company1' } as Company],
				}),
			).rejects.toThrow(InternalServerErrorException);
		});
	});
});
