import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Grouping } from 'src/modules/groupings/grouping.entity';
import { Repository } from 'typeorm';
import { Questionary } from '../../questionary.entity';
import { AddGroupingToQuestionaryService } from '../add-grouping-to-questionary.service';

describe('AddGroupingToQuestionaryService', () => {
	let service: AddGroupingToQuestionaryService;
	let questionariesRepository: Repository<Questionary>;
	let groupingsRepository: Repository<Grouping>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AddGroupingToQuestionaryService,
				{
					provide: getRepositoryToken(Questionary),
					useClass: Repository,
				},
				{
					provide: getRepositoryToken(Grouping),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<AddGroupingToQuestionaryService>(
			AddGroupingToQuestionaryService,
		);
		questionariesRepository = module.get<Repository<Questionary>>(
			getRepositoryToken(Questionary),
		);
		groupingsRepository = module.get<Repository<Grouping>>(
			getRepositoryToken(Grouping),
		);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('execute', () => {
		const groupingId = 'groupingId';
		const questionaryId = 'questionaryId';
		const mockGrouping = new Grouping();
		const mockQuestionary = new Questionary();
		mockQuestionary.groupings = [];

		it('should throw BadRequestException if questionary not found', async () => {
			jest.spyOn(
				questionariesRepository,
				'findOne',
			).mockResolvedValueOnce(undefined);

			await expect(
				service.execute({ groupingId, questionaryId }),
			).rejects.toThrowError(BadRequestException);
		});

		it('should throw BadRequestException if grouping not found', async () => {
			jest.spyOn(
				questionariesRepository,
				'findOne',
			).mockResolvedValueOnce(mockQuestionary);
			jest.spyOn(groupingsRepository, 'findOne').mockResolvedValueOnce(
				undefined,
			);

			await expect(
				service.execute({ groupingId, questionaryId }),
			).rejects.toThrowError(BadRequestException);
		});

		it('should execute correctly', async () => {
			jest.spyOn(
				questionariesRepository,
				'findOne',
			).mockResolvedValueOnce(mockQuestionary);
			jest.spyOn(groupingsRepository, 'findOne').mockResolvedValueOnce(
				mockGrouping,
			);
			jest.spyOn(questionariesRepository, 'save').mockResolvedValueOnce(
				undefined,
			);
			await service.execute({ groupingId, questionaryId });

			expect(questionariesRepository.findOne).toHaveBeenCalledWith({
				where: { _eq: questionaryId },
				relations: { groupings: true },
			});
			expect(groupingsRepository.findOne).toHaveBeenCalledWith({
				where: { _eq: groupingId },
			});
			expect(questionariesRepository.save).toHaveBeenCalledWith(
				mockQuestionary,
			);
		});

		it('should throw InternalServerErrorException if questionary findOne throws', async () => {
			jest.spyOn(
				questionariesRepository,
				'findOne',
			).mockRejectedValueOnce(new Error());

			await expect(
				service.execute({ groupingId, questionaryId }),
			).rejects.toThrowError(InternalServerErrorException);
		});

		it('should throw InternalServerErrorException if grouping findOne throws', async () => {
			jest.spyOn(
				questionariesRepository,
				'findOne',
			).mockResolvedValueOnce(mockQuestionary);
			jest.spyOn(groupingsRepository, 'findOne').mockRejectedValueOnce(
				new Error(),
			);

			await expect(
				service.execute({ groupingId, questionaryId }),
			).rejects.toThrowError(InternalServerErrorException);
		});

		it('should throw InternalServerErrorException if questionary save throws', async () => {
			jest.spyOn(
				questionariesRepository,
				'findOne',
			).mockResolvedValueOnce(mockQuestionary);
			jest.spyOn(groupingsRepository, 'findOne').mockResolvedValueOnce(
				mockGrouping,
			);
			jest.spyOn(questionariesRepository, 'save').mockRejectedValueOnce(
				new Error(),
			);

			await expect(
				service.execute({ groupingId, questionaryId }),
			).rejects.toThrowError(InternalServerErrorException);
		});
	});
});
