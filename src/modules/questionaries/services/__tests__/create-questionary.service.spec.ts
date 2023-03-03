import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { Questionary } from '../../questionary.entity';
import { CreateQuestionaryService } from '../create-questionary.service';
import { Repository } from 'typeorm';

describe('CreateQuestionaryService', () => {
	let service: CreateQuestionaryService;
	let questionariesRepository: Repository<Questionary>;

	beforeEach(async () => {
		const questionariesRepositoryMock = {
			create: jest.fn(),
			save: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateQuestionaryService,
				{
					provide: 'QuestionaryRepository',
					useValue: questionariesRepositoryMock,
				},
			],
		}).compile();

		service = module.get<CreateQuestionaryService>(
			CreateQuestionaryService,
		);
		questionariesRepository = module.get('QuestionaryRepository');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('execute', () => {
		it('should create and save a new questionary', async () => {
			const newQuestionary = { name: 'test' } as Questionary;
			const savedQuestionary = {
				...newQuestionary,
				_eq: '1',
			} as Questionary;
			jest.spyOn(questionariesRepository, 'create').mockReturnValue(
				newQuestionary,
			);
			jest.spyOn(questionariesRepository, 'save').mockResolvedValue(
				savedQuestionary,
			);

			const result = await service.execute();

			expect(result).toEqual(savedQuestionary._eq);
			expect(questionariesRepository.create).toHaveBeenCalledWith({
				name: '',
			});
			expect(questionariesRepository.save).toHaveBeenCalledWith(
				newQuestionary,
			);
		});

		it('should throw an InternalServerErrorException if the questionary could not be saved', async () => {
			const newQuestionary = { name: 'test' } as Questionary;
			jest.spyOn(questionariesRepository, 'create').mockReturnValue(
				newQuestionary,
			);
			jest.spyOn(questionariesRepository, 'save').mockRejectedValue(
				new Error(),
			);

			await expect(service.execute()).rejects.toThrow(
				InternalServerErrorException,
			);
		});
	});
});
