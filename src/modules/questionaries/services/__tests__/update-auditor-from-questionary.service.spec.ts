import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/users.entity';
import { UpdateAuditorFromQuestionaryService } from '../update-auditor-from-questionary.service';
import { Questionary } from '../../questionary.entity';

describe('UpdateAuditorFromQuestionaryService', () => {
	let service: UpdateAuditorFromQuestionaryService;
	let questionariesRepository: Repository<Questionary>;
	let usersRepository: Repository<User>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateAuditorFromQuestionaryService,
				{
					provide: 'QuestionaryRepository',
					useClass: Repository,
				},
				{
					provide: 'UserRepository',
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<UpdateAuditorFromQuestionaryService>(
			UpdateAuditorFromQuestionaryService,
		);
		questionariesRepository = module.get<Repository<Questionary>>(
			'QuestionaryRepository',
		);
		usersRepository = module.get<Repository<User>>('UserRepository');
	});

	describe('execute', () => {
		const questionaryId = '123';
		const auditors = [new User()];

		it('should update the auditors of the questionary and return the available users', async () => {
			const findQuestionary = new Questionary();
			findQuestionary._eq = questionaryId;

			const auditorsIds = auditors.map((a) => a._eq);

			const availableUsers = [new User()];

			jest.spyOn(questionariesRepository, 'findOne').mockResolvedValue(
				findQuestionary,
			);
			jest.spyOn(questionariesRepository, 'save').mockResolvedValue(
				findQuestionary,
			);
			jest.spyOn(usersRepository, 'find').mockResolvedValue(
				availableUsers,
			);

			const result = await service.execute({ questionaryId, auditors });

			expect(questionariesRepository.findOne).toHaveBeenCalledWith({
				where: { _eq: questionaryId },
				relations: {
					auditors: true,
				},
			});
			expect(questionariesRepository.save).toHaveBeenCalledWith(
				findQuestionary,
			);
			expect(usersRepository.find).toHaveBeenCalledWith({
				where: [
					{
						accessLevel: 'auditor',
						_eq: expect.not.arrayContaining(auditorsIds),
					},
					{
						accessLevel: 'master',
						_eq: expect.not.arrayContaining(auditorsIds),
					},
				],
			});
			expect(result).toEqual(availableUsers);
		});

		it('should throw a BadRequestException if the questionary is not found', async () => {
			jest.spyOn(questionariesRepository, 'findOne').mockResolvedValue(
				undefined,
			);

			await expect(
				service.execute({ questionaryId, auditors }),
			).rejects.toThrowError(
				new BadRequestException(
					'Não foi possível encontrar o questionário solicitado.',
				),
			);
		});

		it('should throw an InternalServerErrorException if there is an error fetching the questionary from the database', async () => {
			jest.spyOn(questionariesRepository, 'findOne').mockRejectedValue(
				new Error('Database error'),
			);

			await expect(
				service.execute({ questionaryId, auditors }),
			).rejects.toThrowError(
				new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description: 'Error fetching questionary from database',
					},
				),
			);
		});

		it('should throw an InternalServerErrorException if there is an error saving the questionary to the database', async () => {
			const findQuestionary = new Questionary();
			findQuestionary._eq = questionaryId;

			jest.spyOn(questionariesRepository, 'findOne').mockResolvedValue(
				findQuestionary,
			);
			jest.spyOn(questionariesRepository, 'save').mockRejectedValue(
				new Error('Database error'),
			);

			await expect(
				service.execute({ questionaryId, auditors }),
			).rejects.toThrowError(
				new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description: 'Error saving questionary to database',
					},
				),
			);
		});

		it('should throw an InternalServerErrorException if there is an error fetching the available users from the database', async () => {
			const findQuestionary = new Questionary();
			findQuestionary._eq = questionaryId;

			jest.spyOn(questionariesRepository, 'findOne').mockResolvedValue(
				findQuestionary,
			);
			jest.spyOn(questionariesRepository, 'save').mockResolvedValue(
				findQuestionary,
			);
			jest.spyOn(usersRepository, 'find').mockRejectedValue(
				new Error('Database error'),
			);

			await expect(
				service.execute({ questionaryId, auditors }),
			).rejects.toThrowError(
				new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description:
							'Error fetching available users from database',
					},
				),
			);
		});
	});
});
