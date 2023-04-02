import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateQuestionService } from '../create-question.service';
import { Question } from '../../question.entity';
import { CreateQuestionDTO } from '../../dtos/create-question.dto';

describe('CreateQuestionService', () => {
	let service: CreateQuestionService;
	let questionsRepository: Repository<Question>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateQuestionService,
				{
					provide: getRepositoryToken(Question),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<CreateQuestionService>(CreateQuestionService);
		questionsRepository = module.get<Repository<Question>>(
			getRepositoryToken(Question),
		);
	});

	describe('execute', () => {
		it('should create a question and return it', async () => {
			const createQuestionDTO: CreateQuestionDTO = {
				question: 'Question Title',
				description: 'Question Description',
			} as CreateQuestionDTO;

			const createdQuestion = {
				_eq: '1',
				question: 'Question Title',
				description: 'Question Description',
			} as Question;

			jest.spyOn(questionsRepository, 'create').mockReturnValueOnce(
				createdQuestion,
			);
			jest.spyOn(questionsRepository, 'save').mockResolvedValueOnce(
				createdQuestion,
			);

			const result = await service.execute(createQuestionDTO);

			expect(questionsRepository.create).toHaveBeenCalledWith(
				createQuestionDTO,
			);
			expect(questionsRepository.save).toHaveBeenCalledWith(
				createdQuestion,
			);
			expect(result).toEqual(createdQuestion);
		});

		it('should throw an InternalServerErrorException when an error occurs while saving the question', async () => {
			const createQuestionDTO: CreateQuestionDTO = {
				question: 'Question Title',
				description: 'Question Description',
			} as CreateQuestionDTO;

			jest.spyOn(questionsRepository, 'create').mockReturnValueOnce({
				_eq: '1',
				...createQuestionDTO,
			} as Question);
			jest.spyOn(questionsRepository, 'save').mockRejectedValueOnce(
				new Error(),
			);

			await expect(service.execute(createQuestionDTO)).rejects.toThrow(
				InternalServerErrorException,
			);
		});
	});
});
