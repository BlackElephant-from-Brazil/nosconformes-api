import { Test, TestingModule } from '@nestjs/testing';
import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'src/modules/questions/question.entity';
import { AddQuestionsToGroupingService } from '../add-questions-to-grouping.service';
import { Grouping } from '../../grouping.entity';

describe('AddQuestionsToGroupingService', () => {
	let service: AddQuestionsToGroupingService;
	let groupingRepository: Repository<Grouping>;
	let questionRepository: Repository<Question>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AddQuestionsToGroupingService,
				{
					provide: getRepositoryToken(Grouping),
					useClass: jest.fn(() => ({
						findOne: jest.fn(),
						save: jest.fn(),
					})),
				},
				{
					provide: getRepositoryToken(Question),
					useClass: jest.fn(() => ({
						find: jest.fn(),
					})),
				},
			],
		}).compile();

		service = module.get<AddQuestionsToGroupingService>(
			AddQuestionsToGroupingService,
		);
		groupingRepository = module.get(getRepositoryToken(Grouping));
		questionRepository = module.get(getRepositoryToken(Question));
	});

	describe('execute', () => {
		const groupingId = 'test-grouping-id';
		const questionsIds = ['test-question-id-1', 'test-question-id-2'];
		let mockFindOne;
		let mockSave;
		let mockFind;

		beforeEach(() => {
			mockFindOne = jest.spyOn(groupingRepository, 'findOne');
			mockFind = jest.spyOn(questionRepository, 'find');
			mockSave = jest.spyOn(groupingRepository, 'save');
		});

		afterEach(() => {
			mockFindOne.mockReset();
			mockFind.mockReset();
			mockSave.mockReset();
		});

		it('should add questions to grouping', async () => {
			const mockGrouping = {
				id: groupingId,
				questions: [],
			};
			const mockQuestions = [
				{ id: questionsIds[0] },
				{ id: questionsIds[1] },
			];

			mockFindOne.mockResolvedValueOnce(mockGrouping);
			mockFind.mockResolvedValueOnce(mockQuestions);
			mockSave.mockResolvedValueOnce(mockGrouping);

			await expect(
				service.execute({ groupingId, questionsIds }),
			).resolves.toBeUndefined();

			expect(mockFindOne).toHaveBeenCalledWith({
				where: { _eq: groupingId },
				relations: { questions: true },
			});
			expect(mockFind).toHaveBeenCalledWith({
				where: { _eq: expect.arrayContaining(questionsIds) },
			});
			expect(mockSave).toHaveBeenCalledWith({
				...mockGrouping,
				questions: [...mockGrouping.questions, ...mockQuestions],
			});
		});

		it('should throw BadRequestException when grouping is not found', async () => {
			mockFindOne.mockResolvedValueOnce(undefined);

			await expect(
				service.execute({ groupingId, questionsIds }),
			).rejects.toThrow(BadRequestException);

			expect(mockFindOne).toHaveBeenCalledWith({
				where: { _eq: groupingId },
				relations: { questions: true },
			});
			expect(mockFind).not.toHaveBeenCalled();
			expect(mockSave).not.toHaveBeenCalled();
		});

		it('should throw InternalServerErrorException when groupingRepository.findOne() throws', async () => {
			mockFindOne.mockRejectedValue(new Error());

			await expect(
				service.execute({ groupingId, questionsIds }),
			).rejects.toThrow(InternalServerErrorException);

			expect(mockFindOne).toHaveBeenCalledWith({
				where: { _eq: groupingId },
				relations: { questions: true },
			});
			expect(mockFind).not.toHaveBeenCalled();
			expect(mockSave).not.toHaveBeenCalled();
		});

		it('should throw InternalServerErrorException when questionRepository.find() throws', async () => {
			const mockGrouping = {
				id: groupingId,
				questions: [],
			};

			mockFindOne.mockResolvedValueOnce(mockGrouping);
			mockFind.mockRejectedValue(new Error());

			await expect(
				service.execute({ groupingId, questionsIds }),
			).rejects.toThrow(InternalServerErrorException);

			expect(mockFindOne).toHaveBeenCalledWith({
				where: { _eq: groupingId },
				relations: { questions: true },
			});
			expect(mockFind).toHaveBeenCalledWith({
				where: { _eq: expect.arrayContaining(questionsIds) },
			});
			expect(mockSave).not.toHaveBeenCalled();
		});

		it('should throw InternalServerErrorException when groupingRepository.save() throws', async () => {
			const mockGrouping = {
				id: groupingId,
				questions: [],
			};
			const mockQuestions = [
				{ id: questionsIds[0] },
				{ id: questionsIds[1] },
			];

			mockFindOne.mockResolvedValueOnce(mockGrouping);
			mockFind.mockResolvedValueOnce(mockQuestions);
			mockSave.mockRejectedValue(new Error());

			await expect(
				service.execute({ groupingId, questionsIds }),
			).rejects.toThrow(InternalServerErrorException);

			expect(mockFindOne).toHaveBeenCalledWith({
				where: { _eq: groupingId },
				relations: { questions: true },
			});
			expect(mockFind).toHaveBeenCalledWith({
				where: { _eq: expect.arrayContaining(questionsIds) },
			});
			expect(mockSave).toHaveBeenCalledWith({
				...mockGrouping,
				questions: [...mockGrouping.questions, ...mockQuestions],
			});
		});
	});
});
