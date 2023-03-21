import { FindOperator, ILike } from 'typeorm';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { User } from '../../users.entity';
import { FindUsersService } from '../find-users.service';

describe('FindUsersService', () => {
	let service: FindUsersService;
	let repository: Repository<User>;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				FindUsersService,
				{
					provide: 'UserRepository',
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<FindUsersService>(FindUsersService);
		repository = module.get<Repository<User>>('UserRepository');
	});

	describe('execute', () => {
		it('should return an array of users matching the query', async () => {
			const users = [
				{
					_eq: '1',
					name: 'John Doe',
					email: 'johndoe@example.com',
					office: 'New York',
					accessLevel: 'admin',
				},
				{
					_eq: '2',
					name: 'Jane Doe',
					email: 'jane@example.com',
					office: 'Los Angeles',
					accessLevel: 'user',
				},
			];
			jest.spyOn(repository, 'find').mockImplementation(
				() => Promise.resolve(users) as Promise<User[]>,
			);

			const query = 'johndoe@example.com';
			const result = await service.execute(query);

			expect(repository.find).toHaveBeenCalledWith({
				where: [
					{
						accessLevel: ILike(`%${query}%`) as
							| FindOperator<'gestor'>
							| FindOperator<'auditor'>
							| FindOperator<'master'>
							| FindOperator<'consultor'>,
					},
					{
						email: ILike(`%${query}%`),
					},
					{
						name: ILike(`%${query}%`),
					},
					{
						office: ILike(`%${query}%`),
					},
				],
			});
			expect(result).toEqual(users);
		});

		it('should return an empty array if no users matching the query', async () => {
			jest.spyOn(repository, 'find').mockImplementation(() =>
				Promise.resolve([]),
			);

			const query = 'notexist@example.com';
			const result = await service.execute(query);

			expect(repository.find).toHaveBeenCalledWith({
				where: [
					{
						accessLevel: ILike(`%${query}%`) as
							| FindOperator<'gestor'>
							| FindOperator<'auditor'>
							| FindOperator<'master'>
							| FindOperator<'consultor'>,
					},
					{
						email: ILike(`%${query}%`),
					},
					{
						name: ILike(`%${query}%`),
					},
					{
						office: ILike(`%${query}%`),
					},
				],
			});
			expect(result).toEqual([]);
		});

		it('should throw an InternalServerErrorException if an error occurs while trying to find the users', async () => {
			jest.spyOn(repository, 'find').mockImplementation(() => {
				throw new Error('error');
			});

			try {
				await service.execute();
			} catch (error) {
				expect(error).toBeInstanceOf(InternalServerErrorException);
				expect(error.message).toBe(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				);
				expect(error.options.description).toBe(
					'This error occurred when trying to find the users in the find-users.service.ts',
				);
			}
		});
	});
});
