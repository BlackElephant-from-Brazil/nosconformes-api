import { Test, TestingModule } from '@nestjs/testing';
import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Questionary } from '../../questionary.entity';
import { DeleteGroupingFromQuestionaryService } from '../delete-grouping-from-questionary.service';

describe('DeleteGroupingFromQuestionaryService', () => {
	let service: DeleteGroupingFromQuestionaryService;
	let questionariesRepository: jest.Mocked<
		Record<keyof Repository<Questionary>, jest.Mock>
	>;

	beforeEach(async () => {
		const questionariesRepositoryMock = {
			findOne: jest.fn(),
			save: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DeleteGroupingFromQuestionaryService,
				{
					provide: getRepositoryToken(Questionary),
					useValue: questionariesRepositoryMock,
				},
			],
		}).compile();

		service = module.get<DeleteGroupingFromQuestionaryService>(
			DeleteGroupingFromQuestionaryService,
		);
		questionariesRepository = module.get(getRepositoryToken(Questionary));
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('execute', () => {
		const questionaryId = '1';
		const groupingId = '2';
		const findQuestionary = {
			id: questionaryId,
			groupings: [{ _eq: groupingId }],
		};

		it('should delete the grouping from the questionary and save it', async () => {
			questionariesRepository.findOne.mockResolvedValue(findQuestionary);

			await service.execute({ questionaryId, groupingId });

			expect(questionariesRepository.findOne).toHaveBeenCalledWith({
				where: { _eq: questionaryId },
				relations: { groupings: true },
			});
			expect(findQuestionary.groupings).toHaveLength(0);
			expect(questionariesRepository.save).toHaveBeenCalledWith(
				findQuestionary,
			);
		});

		it('should throw a BadRequestException if the questionary does not exist', async () => {
			questionariesRepository.findOne.mockResolvedValue(undefined);

			await expect(
				service.execute({ questionaryId, groupingId }),
			).rejects.toThrow(BadRequestException);
		});

		it('should throw an InternalServerErrorException if the questionary could not be fetched', async () => {
			questionariesRepository.findOne.mockRejectedValue(new Error());

			await expect(
				service.execute({ questionaryId, groupingId }),
			).rejects.toThrow(InternalServerErrorException);
		});

		it('should throw an InternalServerErrorException if the questionary could not be saved', async () => {
			questionariesRepository.findOne.mockResolvedValue(findQuestionary);
			questionariesRepository.save.mockRejectedValue(new Error());

			await expect(
				service.execute({ questionaryId, groupingId }),
			).rejects.toThrow(InternalServerErrorException);
		});
	});
});
