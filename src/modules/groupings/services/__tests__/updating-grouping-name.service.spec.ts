import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grouping } from '../../grouping.entity';
import { UpdatingGroupingNameService } from '../updating-grouping-name.service';

describe('EditGroupingService', () => {
	let service: UpdatingGroupingNameService;
	let repository: Repository<Grouping>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdatingGroupingNameService,
				{
					provide: getRepositoryToken(Grouping),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<UpdatingGroupingNameService>(
			UpdatingGroupingNameService,
		);
		repository = module.get<Repository<Grouping>>(
			getRepositoryToken(Grouping),
		);
	});

	describe('execute', () => {
		const groupingId = '1';
		const name = 'New Grouping Name';
		const params = { groupingId, name };

		it('should throw BadRequestException if grouping is not found', async () => {
			repository.findOne = jest.fn().mockResolvedValueOnce(undefined);

			await expect(service.execute(params)).rejects.toThrowError(
				BadRequestException,
			);
			await expect(service.execute(params)).rejects.toMatchObject({
				message: 'Agrupamento não encontrado.',
			});
		});

		it('should update grouping name', async () => {
			const findGrouping: Grouping = {
				_eq: groupingId,
				name: 'Old Grouping Name',
			} as Grouping;
			repository.findOne = jest.fn().mockResolvedValueOnce(findGrouping);
			repository.save = jest.fn().mockResolvedValueOnce(findGrouping);

			await service.execute(params);

			expect(repository.findOne).toBeCalledWith({
				where: { _eq: groupingId },
			});
			expect(findGrouping.name).toBe(name);
			expect(repository.save).toBeCalledWith(findGrouping);
		});

		it('should throw InternalServerErrorException if findOne throws', async () => {
			repository.findOne = jest.fn().mockRejectedValueOnce(new Error());

			await expect(service.execute(params)).rejects.toThrowError(
				InternalServerErrorException,
			);
			await expect(service.execute(params)).rejects.toMatchObject({
				message:
					'Ocorreu um erro interno no servidor. Tente novamente mais tarde ou contate o suporte.',
				response: {
					description:
						'Erro ao buscar o agrupamento no banco de dados.',
				},
			});
		});

		it('should throw InternalServerErrorException if save throws', async () => {
			const findGrouping: Grouping = {
				_eq: groupingId,
				name: 'Old Grouping Name',
			} as Grouping;
			repository.findOne = jest.fn().mockResolvedValueOnce(findGrouping);
			repository.save = jest.fn().mockRejectedValueOnce(new Error());

			await expect(service.execute(params)).rejects.toThrowError(
				InternalServerErrorException,
			);
		});
	});
});
