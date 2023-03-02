import { Test, TestingModule } from '@nestjs/testing';
import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { FindGroupingByIdService } from '../find-grouping-by-id.service';
import { Grouping } from '../../grouping.entity';

describe('FindGroupingByIdService', () => {
	let service: FindGroupingByIdService;
	let repository: Repository<Grouping>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FindGroupingByIdService,
				{
					provide: 'GroupingRepository',
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<FindGroupingByIdService>(FindGroupingByIdService);
		repository = module.get('GroupingRepository');
	});

	describe('execute', () => {
		it('should return a grouping', async () => {
			const groupingId = '123';
			const expectedGrouping: Grouping = {
				_eq: '1',
				name: 'Grouping 1',
			} as Grouping;

			jest.spyOn(repository, 'findOne').mockResolvedValueOnce(
				expectedGrouping,
			);

			const result = await service.execute(groupingId);

			expect(result).toEqual(expectedGrouping);
			expect(repository.findOne).toHaveBeenCalledWith({
				where: {
					_eq: groupingId,
				},
				relations: {
					questions: true,
				},
			});
		});

		it('should throw a BadRequestException if the grouping is not found', async () => {
			const groupingId = '123';

			jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

			await expect(service.execute(groupingId)).rejects.toThrow(
				new BadRequestException(
					'Não foi possível encontrar o agrupamento informado.',
				),
			);
		});

		it('should throw an InternalServerErrorException if an error occurs', async () => {
			const groupingId = '123';
			const expectedError = new Error('Database error');

			jest.spyOn(repository, 'findOne').mockRejectedValue(expectedError);

			await expect(service.execute(groupingId)).rejects.toThrow(
				new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente mais tarde ou contate o suporte.',
					{
						description:
							'Erro ao buscar agrupamento no banco de dados.',
					},
				),
			);
		});
	});
});
