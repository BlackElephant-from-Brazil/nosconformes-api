import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Grouping } from 'src/modules/groupings/grouping.entity';
import { FindAvailableGroupingsFromQuestionaryService } from '../find-available-groupings-from-questionary.service';
import { Questionary } from '../../questionary.entity';
import { Test } from '@nestjs/testing';

describe('FindAvailableGroupingsFromQuestionaryService', () => {
	let service: FindAvailableGroupingsFromQuestionaryService;
	let questionariesRepository: jest.Mocked<
		Record<keyof Repository<Questionary>, jest.Mock>
	>;
	let groupingsRepository: jest.Mocked<
		Record<keyof Repository<Grouping>, jest.Mock>
	>;

	beforeEach(async () => {
		questionariesRepository = {
			findOne: jest.fn(),
		} as any;
		groupingsRepository = {
			find: jest.fn(),
		} as any;

		const module = await Test.createTestingModule({
			providers: [
				FindAvailableGroupingsFromQuestionaryService,
				{
					provide: getRepositoryToken(Questionary),
					useValue: questionariesRepository,
				},
				{
					provide: getRepositoryToken(Grouping),
					useValue: groupingsRepository,
				},
			],
		}).compile();

		service = module.get<FindAvailableGroupingsFromQuestionaryService>(
			FindAvailableGroupingsFromQuestionaryService,
		);
	});

	describe('execute', () => {
		it('should return available groupings', async () => {
			const questionary = new Questionary();
			questionary._eq = '1';
			questionary.groupings = [
				{ _eq: '1', name: 'Group A' },
				{ _eq: '2', name: 'Group B' },
			] as any;
			const groupings = [
				{ _eq: '3', name: 'Group C' },
				{ _eq: '4', name: 'Group D' },
			] as any;

			questionariesRepository.findOne.mockResolvedValue(questionary);
			groupingsRepository.find.mockResolvedValue(groupings);

			const result = await service.execute('1');

			expect(questionariesRepository.findOne).toHaveBeenCalledWith({
				where: { _eq: '1' },
				relations: { groupings: true },
			});
			expect(groupingsRepository.find).toHaveBeenCalledWith({
				where: { _eq: Not(In(['1', '2'])), name: Not('') },
			});
			expect(result).toEqual(groupings);
		});

		it('should throw BadRequestException when questionary is not found', async () => {
			questionariesRepository.findOne.mockResolvedValue(undefined);

			await expect(service.execute('1')).rejects.toThrowError(
				new BadRequestException('Questionário não encontrado.'),
			);
		});

		it('should throw InternalServerErrorException when questionariesRepository throws error', async () => {
			questionariesRepository.findOne.mockRejectedValue(
				new Error('Database connection error'),
			);

			await expect(service.execute('1')).rejects.toThrowError(
				new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Tente novamente mais tarde ou contate o suporte.',
					{
						description:
							'Erro ao buscar o questionário no banco de dados.',
					},
				),
			);
		});

		it('should throw InternalServerErrorException when groupingsRepository throws error', async () => {
			const questionary = new Questionary();
			questionary._eq = '1';
			questionary.groupings = [] as any;

			questionariesRepository.findOne.mockResolvedValue(questionary);
			groupingsRepository.find.mockRejectedValue(
				new Error('Database connection error'),
			);

			await expect(service.execute('1')).rejects.toThrowError(
				new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Tente novamente mais tarde ou contate o suporte.',
					{
						description:
							'Erro ao buscar os agrupamentos no banco de dados.',
					},
				),
			);
		});
	});
});
