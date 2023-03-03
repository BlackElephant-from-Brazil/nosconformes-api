import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EditQuestionaryService } from '../edit-questionary.service';
import { Questionary } from '../../questionary.entity';
import { EditQuestionaryDTO } from '../../dtos/edit-questionary.dto';

describe('EditQuestionaryService', () => {
	let service: EditQuestionaryService;
	let questionariesRepository: Repository<Questionary>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				EditQuestionaryService,
				{
					provide: getRepositoryToken(Questionary),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<EditQuestionaryService>(EditQuestionaryService);
		questionariesRepository = module.get<Repository<Questionary>>(
			getRepositoryToken(Questionary),
		);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('execute', () => {
		const editQuestionaryDTO: EditQuestionaryDTO = {
			name: 'Questionário Editado',
			questionaryId: 'questionary_id',
		};

		const existingQuestionary: Questionary = {
			_eq: 'questionary_id',
			name: 'Questionário Antigo',
		} as Questionary;

		it('should update the questionary name', async () => {
			jest.spyOn(questionariesRepository, 'findOne').mockResolvedValue(
				existingQuestionary,
			);
			jest.spyOn(questionariesRepository, 'save').mockResolvedValueOnce(
				existingQuestionary,
			);

			const result = await service.execute(editQuestionaryDTO);

			expect(result.name).toBe(editQuestionaryDTO.name);
			expect(questionariesRepository.save).toHaveBeenCalledWith(
				existingQuestionary,
			);
		});

		it('should throw BadRequestException if questionary is not found', async () => {
			jest.spyOn(questionariesRepository, 'findOne').mockResolvedValue(
				undefined,
			);

			await expect(service.execute(editQuestionaryDTO)).rejects.toThrow(
				BadRequestException,
			);
			expect(questionariesRepository.findOne).toHaveBeenCalledWith({
				where: { _eq: editQuestionaryDTO.questionaryId },
			});
		});

		it('should throw InternalServerErrorException if database operation fails', async () => {
			jest.spyOn(questionariesRepository, 'findOne').mockRejectedValue(
				new Error(),
			);
			await expect(service.execute(editQuestionaryDTO)).rejects.toThrow(
				InternalServerErrorException,
			);
			expect(questionariesRepository.findOne).toHaveBeenCalledWith({
				where: { _eq: editQuestionaryDTO.questionaryId },
			});

			jest.spyOn(questionariesRepository, 'findOne').mockResolvedValue(
				existingQuestionary,
			);
			jest.spyOn(questionariesRepository, 'save').mockRejectedValue(
				new Error(),
			);
			await expect(service.execute(editQuestionaryDTO)).rejects.toThrow(
				InternalServerErrorException,
			);
			expect(questionariesRepository.save).toHaveBeenCalledWith(
				existingQuestionary,
			);
		});
	});
});
