import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { FindQuestionaryByIdService } from '../find-questionary-by-id.service';
import { Questionary } from '../../questionary.entity';

describe('FindQuestionaryByIdService', () => {
	let service: FindQuestionaryByIdService;
	let questionariesRepository: Repository<Questionary>;

	const mockQuestionary: Questionary = {
		_eq: '1',
		name: 'Mock Questionary',
		auditors: [],
		companies: [],
		groupings: [],
	} as Questionary;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FindQuestionaryByIdService,
				{
					provide: getRepositoryToken(Questionary),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<FindQuestionaryByIdService>(
			FindQuestionaryByIdService,
		);
		questionariesRepository = module.get<Repository<Questionary>>(
			getRepositoryToken(Questionary),
		);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should find a questionary by ID', async () => {
		jest.spyOn(questionariesRepository, 'findOne').mockResolvedValueOnce(
			mockQuestionary,
		);

		const questionaryId = '1';
		const result = await service.execute(questionaryId);

		expect(result).toEqual(mockQuestionary);
		expect(questionariesRepository.findOne).toHaveBeenCalledWith({
			where: {
				_eq: questionaryId,
			},
			relations: {
				auditors: true,
				companies: true,
				groupings: true,
			},
		});
	});

	it('should throw an InternalServerErrorException if an error occurs during find', async () => {
		jest.spyOn(questionariesRepository, 'findOne').mockRejectedValueOnce(
			new Error('Mock error'),
		);

		const questionaryId = '1';
		await expect(service.execute(questionaryId)).rejects.toThrow(
			InternalServerErrorException,
		);
	});
});
