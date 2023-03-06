import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FindAllGroupingsService } from '../find-all-groupings.service';
import { Grouping } from '../../grouping.entity';

describe('FindAllGroupingsService', () => {
	let service: FindAllGroupingsService;
	let repository: Repository<Grouping>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FindAllGroupingsService,
				{
					provide: 'GroupingRepository',
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<FindAllGroupingsService>(FindAllGroupingsService);
		repository = module.get('GroupingRepository');
	});

	describe('execute', () => {
		it('should return an array of groupings', async () => {
			const expectedGroupings: Grouping[] = [
				{ _eq: '1', name: 'Grouping 1' } as Grouping,
				{ _eq: '2', name: 'Grouping 2' } as Grouping,
			];

			jest.spyOn(repository, 'find').mockResolvedValue(expectedGroupings);

			const result = await service.execute();

			expect(result).toEqual(expectedGroupings);
		});

		it('should throw an InternalServerErrorException if an error occurs', async () => {
			const expectedError = new Error('Database error');

			jest.spyOn(repository, 'find').mockRejectedValue(expectedError);

			await expect(service.execute()).rejects.toThrow(
				new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente mais tarde ou contate o suporte.',
					{
						description:
							'Erro ao buscar agrupamentos no banco de dados.',
					},
				),
			);
		});
	});
});
