import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Questionary } from '../../questionary.entity';
import { FindQuestionariesService } from '../find-questionaries.service';

describe('FindQuestionariesService', () => {
	let service: FindQuestionariesService;
	let questionariesRepository: Repository<Questionary>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FindQuestionariesService,
				{
					provide: getRepositoryToken(Questionary),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<FindQuestionariesService>(
			FindQuestionariesService,
		);
		questionariesRepository = module.get(getRepositoryToken(Questionary));
	});

	describe('execute', () => {
		it('should return an array of questionaries', async () => {
			const questionariesMock = [
				{
					_eq: '1',
					name: 'Questionary 1',
					auditors: [],
					companies: [],
					groupings: [],
				},
				{
					_eq: '2',
					name: 'Questionary 2',
					auditors: [],
					companies: [],
					groupings: [],
				},
			] as Questionary[];

			jest.spyOn(questionariesRepository, 'find').mockResolvedValueOnce(
				questionariesMock,
			);

			const result = await service.execute();

			expect(result).toBe(questionariesMock);
		});

		it('should return an array of questionaries filtered by query', async () => {
			const query = 'questionary';
			const questionariesMock = [
				{
					_eq: '1',
					name: 'Questionary 1',
					auditors: [],
					companies: [],
					groupings: [],
				},
				{
					_eq: '2',
					name: 'Questionary 2',
					auditors: [],
					companies: [],
					groupings: [],
				},
			] as Questionary[];

			jest.spyOn(questionariesRepository, 'find').mockResolvedValueOnce(
				questionariesMock,
			);

			const result = await service.execute(query);

			expect(questionariesRepository.find).toHaveBeenCalledWith({
				where: {
					name: expect.stringMatching(`%${query}%`),
				},
				order: {
					name: 'ASC',
				},
				relations: {
					auditors: true,
					companies: true,
					groupings: true,
				},
			});
			expect(result).toBe(questionariesMock);
		});

		it('should throw InternalServerErrorException when questionariesRepository throws error', async () => {
			const query = 'questionary';

			jest.spyOn(questionariesRepository, 'find').mockRejectedValueOnce(
				new Error(),
			);

			await expect(service.execute(query)).rejects.toThrow(
				InternalServerErrorException,
			);
		});
	});
});
