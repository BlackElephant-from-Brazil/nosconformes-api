import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateGroupingService } from '../create-grouping.service';
import { Grouping } from '../../grouping.entity';
import { Questionary } from 'src/modules/questionaries/questionary.entity';
import { CreateGroupingDTO } from '../../dtos/create-grouping.dto';

describe('CreateGroupingService', () => {
	let service: CreateGroupingService;
	let groupingsRepository: Repository<Grouping>;
	let questionariesRepository: Repository<Questionary>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateGroupingService,
				{
					provide: 'GroupingRepository',
					useClass: Repository,
				},
				{
					provide: 'QuestionaryRepository',
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<CreateGroupingService>(CreateGroupingService);
		groupingsRepository = module.get('GroupingRepository');
		questionariesRepository = module.get('QuestionaryRepository');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('execute', () => {
		const createGroupingDTO: CreateGroupingDTO = {
			questionaryId: '1',
		};

		it('should create a new grouping and associate it with the specified questionary', async () => {
			const grouping = new Grouping();
			const questionary = new Questionary();
			questionary.groupings = [];

			jest.spyOn(groupingsRepository, 'create').mockReturnValue(grouping);
			jest.spyOn(groupingsRepository, 'save').mockResolvedValue(grouping);
			jest.spyOn(questionariesRepository, 'findOne').mockResolvedValue(
				questionary,
			);
			jest.spyOn(questionariesRepository, 'save').mockResolvedValue(
				questionary,
			);

			const result = await service.execute(createGroupingDTO);

			expect(groupingsRepository.create).toHaveBeenCalledWith({
				name: '',
			});
			expect(groupingsRepository.save).toHaveBeenCalledWith(grouping);
			expect(questionariesRepository.findOne).toHaveBeenCalledWith({
				where: {
					_eq: createGroupingDTO.questionaryId,
				},
				relations: {
					groupings: true,
				},
			});
			expect(questionary.groupings).toContain(grouping);
			expect(questionariesRepository.save).toHaveBeenCalledWith(
				questionary,
			);
			expect(result).toEqual(grouping);
		});

		it('should throw an InternalServerErrorException when there is an error saving the grouping', async () => {
			jest.spyOn(groupingsRepository, 'create').mockReturnValue(
				new Grouping(),
			);
			jest.spyOn(groupingsRepository, 'save').mockRejectedValue(
				new Error(),
			);

			await expect(service.execute(createGroupingDTO)).rejects.toThrow(
				new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description:
							'This error occurred when trying to save the grouping in the create-grouping.service.ts',
					},
				),
			);
		});

		it('should throw an InternalServerErrorException when there is an error finding the questionary', async () => {
			const grouping = new Grouping();
			const questionary = new Questionary();
			questionary.groupings = [];

			jest.spyOn(groupingsRepository, 'create').mockReturnValue(grouping);
			jest.spyOn(groupingsRepository, 'save').mockResolvedValue(grouping);

			jest.spyOn(questionariesRepository, 'findOne').mockRejectedValue(
				new Error(),
			);

			jest.spyOn(questionariesRepository, 'save').mockRejectedValue('');

			await expect(service.execute(createGroupingDTO)).rejects.toThrow(
				InternalServerErrorException,
			);

			expect(questionariesRepository.findOne).toHaveBeenCalledWith({
				where: {
					_eq: createGroupingDTO.questionaryId,
				},
				relations: {
					groupings: true,
				},
			});

			expect(groupingsRepository.create).toHaveBeenCalledWith({
				name: '',
			});

			expect(groupingsRepository.save).toHaveBeenCalledWith(
				expect.any(Grouping),
			);

			expect(questionariesRepository.save).not.toHaveBeenCalled();
		});

		it('should throw an InternalServerErrorException when there is an error saving the questionary', async () => {
			const grouping = new Grouping();
			const questionary = new Questionary();
			questionary.groupings = [];

			jest.spyOn(groupingsRepository, 'create').mockReturnValue(grouping);
			jest.spyOn(groupingsRepository, 'save').mockResolvedValue(grouping);
			jest.spyOn(questionariesRepository, 'findOne').mockResolvedValue(
				questionary,
			);
			jest.spyOn(questionariesRepository, 'save').mockRejectedValue(
				new Error(),
			);

			await expect(service.execute(createGroupingDTO)).rejects.toThrow(
				InternalServerErrorException,
			);
			expect(questionariesRepository.save).toHaveBeenCalled();
		});
	});
});
