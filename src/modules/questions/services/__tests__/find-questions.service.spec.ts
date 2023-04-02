import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { FindQuestionsService } from '../find-questions.service';
import { Question } from '../../question.entity';

describe('FindQuestionsService', () => {
	let service: FindQuestionsService;
	let questionsRepository: Repository<Question>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FindQuestionsService,
				{
					provide: getRepositoryToken(Question),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<FindQuestionsService>(FindQuestionsService);
		questionsRepository = module.get<Repository<Question>>(
			getRepositoryToken(Question),
		);
	});

	describe('execute', () => {
		it('should return an empty array if no questions found', async () => {
			jest.spyOn(questionsRepository, 'find').mockResolvedValueOnce([]);

			const result = await service.execute();

			expect(result).toEqual([]);
			expect(questionsRepository.find).toHaveBeenCalledWith({
				where: [{ question: ILike('%%') }],
				order: {
					question: 'ASC',
				},
			});
		});

		it('should return an array of questions if they are found', async () => {
			const question1 = new Question();
			question1.id = '1';
			question1.question = 'Question 1';

			const question2 = new Question();
			question2.id = '2';
			question2.question = 'Question 2';

			jest.spyOn(questionsRepository, 'find').mockResolvedValueOnce([
				question1,
				question2,
			]);

			const result = await service.execute();

			expect(result).toEqual([question1, question2]);
			expect(questionsRepository.find).toHaveBeenCalledWith({
				where: [{ question: ILike('%%') }],
				order: {
					question: 'ASC',
				},
			});
		});

		it('should return an array of questions that match the query if it is provided', async () => {
			const question1 = new Question();
			question1.id = '1';
			question1.question = 'Question 1';

			const question2 = new Question();
			question2.id = '2';
			question2.question = 'Question 2';

			jest.spyOn(questionsRepository, 'find').mockResolvedValueOnce([
				question2,
				question1,
			]);

			const result = await service.execute('quest');

			expect(result).toEqual([question2, question1]);
			expect(questionsRepository.find).toHaveBeenCalledWith({
				where: [{ question: ILike('%quest%') }],
				order: {
					question: 'ASC',
				},
			});
		});

		it('should throw an InternalServerErrorException if there is an error finding questions', async () => {
			jest.spyOn(questionsRepository, 'find').mockRejectedValueOnce(
				new Error('Database error'),
			);

			await expect(service.execute()).rejects.toThrow(
				InternalServerErrorException,
			);
		});
	});
});
