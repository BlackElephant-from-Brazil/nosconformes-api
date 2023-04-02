import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/modules/users/users.entity';
import { Questionary } from '../../questionary.entity';
import { FindAvailableAuditorsForQuestionaryService } from '../find-available-auditors-for-questionary.service';

describe('FindAvailableAuditorsForQuestionaryService', () => {
	let service: FindAvailableAuditorsForQuestionaryService;

	const mockUsersRepository = {
		find: jest.fn(),
	};

	const mockQuestionariesRepository = {
		findOne: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FindAvailableAuditorsForQuestionaryService,
				{
					provide: getRepositoryToken(User),
					useValue: mockUsersRepository,
				},
				{
					provide: getRepositoryToken(Questionary),
					useValue: mockQuestionariesRepository,
				},
			],
		}).compile();

		service = module.get<FindAvailableAuditorsForQuestionaryService>(
			FindAvailableAuditorsForQuestionaryService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		const questionaryId = 'fake-questionary-id';
		const auditors = [{ _eq: 'auditor1' }, { _eq: 'auditor2' }];
		const mockFindOne = jest.fn().mockResolvedValue({ auditors });
		const mockFind = jest.fn().mockResolvedValue([
			{ accessLevel: 'auditor', _eq: 'auditor3' },
			{ accessLevel: 'master', _eq: 'master1' },
		]);

		beforeEach(() => {
			mockQuestionariesRepository.findOne.mockImplementation(mockFindOne);
			mockUsersRepository.find.mockImplementation(mockFind);
		});

		it('should return available auditors for the questionary', async () => {
			const result = await service.execute(questionaryId);

			expect(mockQuestionariesRepository.findOne).toHaveBeenCalledWith({
				where: { _eq: questionaryId },
				relations: { auditors: true },
			});
			expect(mockUsersRepository.find).toHaveBeenCalledWith({
				where: [
					{
						accessLevel: 'auditor',
						_eq: { $notIn: auditors.map((a) => a._eq) },
					},
					{
						accessLevel: 'master',
						_eq: { $notIn: auditors.map((a) => a._eq) },
					},
				],
			});
			expect(result).toEqual([
				{ accessLevel: 'auditor', _eq: 'auditor3' },
				{ accessLevel: 'master', _eq: 'master1' },
			]);
		});

		it('should throw BadRequestException when questionary is not found', async () => {
			mockQuestionariesRepository.findOne.mockResolvedValue(undefined);

			await expect(service.execute(questionaryId)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw InternalServerErrorException when questionary repository throws an error', async () => {
			mockQuestionariesRepository.findOne.mockRejectedValue(new Error());

			await expect(service.execute(questionaryId)).rejects.toThrow(
				InternalServerErrorException,
			);
		});

		it('should throw InternalServerErrorException when user repository throws an error', async () => {
			mockUsersRepository.find.mockRejectedValue(new Error());

			await expect(service.execute(questionaryId)).rejects.toThrow(
				InternalServerErrorException,
			);
		});
	});
});
