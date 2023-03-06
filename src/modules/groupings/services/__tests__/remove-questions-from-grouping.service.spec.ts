import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from 'src/modules/questions/question.entity';
import { Repository } from 'typeorm';
import { Grouping } from '../../grouping.entity';
import { RemoveQuestionsFromGroupingService } from '../remove-questions-from-grouping.service';

describe('RemoveQuestionsFromGroupingService', () => {
	let removeQuestionsFromGroupingService: RemoveQuestionsFromGroupingService;
	let groupingsRepository: Repository<Grouping>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RemoveQuestionsFromGroupingService,
				{
					provide: getRepositoryToken(Grouping),
					useClass: Repository,
				},
				{
					provide: getRepositoryToken(Question),
					useClass: Repository,
				},
			],
		}).compile();

		removeQuestionsFromGroupingService =
			module.get<RemoveQuestionsFromGroupingService>(
				RemoveQuestionsFromGroupingService,
			);
		groupingsRepository = module.get<Repository<Grouping>>(
			getRepositoryToken(Grouping),
		);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('execute', () => {
		const groupingId = '1';
		const questionId1 = '1';
		const questionId2 = '2';
		const questionsIds = [questionId1, questionId2];
		const groupingWithQuestions: Grouping = {
			_eq: groupingId,
			name: 'Grouping',
			questions: [
				{ _eq: questionId1, question: 'Question 1' } as Question,
				{ _eq: questionId2, question: 'Question 2' } as Question,
			],
		} as Grouping;
		const groupingWithoutQuestions: Grouping = {
			_eq: groupingId,
			name: 'Grouping',
			questions: [],
		} as Grouping;

		it('should remove questions from grouping', async () => {
			jest.spyOn(groupingsRepository, 'findOne').mockResolvedValueOnce(
				groupingWithQuestions,
			);
			jest.spyOn(groupingsRepository, 'save').mockResolvedValueOnce(
				groupingWithoutQuestions,
			);

			const result = await removeQuestionsFromGroupingService.execute({
				groupingId,
				questionsIds,
			});

			expect(result).toEqual(groupingWithoutQuestions);
			expect(groupingsRepository.findOne).toHaveBeenCalledWith(
				groupingId,
				{
					relations: ['questions'],
				},
			);
			expect(groupingsRepository.save).toHaveBeenCalledWith(
				groupingWithoutQuestions,
			);
		});

		it('should throw a BadRequestException if grouping is not found', async () => {
			jest.spyOn(groupingsRepository, 'findOne').mockResolvedValueOnce(
				null,
			);

			await expect(
				removeQuestionsFromGroupingService.execute({
					groupingId,
					questionsIds,
				}),
			).rejects.toThrow(
				new BadRequestException(
					'Não foi possível encontrar o agrupamento informado.',
				),
			);
		});

		it('should throw a InternalServerErrorException if got some error on find grouping', async () => {
			jest.spyOn(groupingsRepository, 'findOne').mockRejectedValueOnce(
				new Error(),
			);

			await expect(
				removeQuestionsFromGroupingService.execute({
					groupingId,
					questionsIds,
				}),
			).rejects.toThrow(new InternalServerErrorException());
		});

		it('should throw a InternalServerErrorException if got some error on save grouping', async () => {
			jest.spyOn(groupingsRepository, 'findOne').mockResolvedValueOnce(
				groupingWithQuestions,
			);
			jest.spyOn(groupingsRepository, 'save').mockRejectedValueOnce(
				new Error(),
			);

			await expect(
				removeQuestionsFromGroupingService.execute({
					groupingId,
					questionsIds,
				}),
			).rejects.toThrow(new InternalServerErrorException());
		});
	});
});
