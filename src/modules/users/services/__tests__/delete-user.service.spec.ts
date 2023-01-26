import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users.entity';
import { DeleteUserService } from '../delete-user.service';

describe('DeleteUserService', () => {
	let deleteUserService: DeleteUserService;
	let usersRepository: Repository<User>;

	beforeEach(async () => {
		const testingModule = await Test.createTestingModule({
			providers: [
				DeleteUserService,
				{
					provide: getRepositoryToken(User),
					useValue: {
						findOne: jest.fn(),
						delete: jest.fn(),
					},
				},
			],
		}).compile();

		deleteUserService =
			testingModule.get<DeleteUserService>(DeleteUserService);
		usersRepository = testingModule.get<Repository<User>>(
			getRepositoryToken(User),
		);
	});

	describe('execute', () => {
		it('should return an error if user is not found', async () => {
			jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

			try {
				await deleteUserService.execute('user-id');
			} catch (e) {
				expect(e.message).toBe(
					'O usuário que você buscou não é um usuário válido.',
				);
			}
		});

		it('should return an error if there is an internal server error while finding user', async () => {
			jest.spyOn(usersRepository, 'findOne').mockRejectedValue(
				new Error('error'),
			);

			try {
				await deleteUserService.execute('user-id');
			} catch (e) {
				expect(e.message).toBe(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				);
				expect(e.options.description).toBe(
					'This error occurred when trying to find the user in the delete-user.service.ts',
				);
			}
		});

		it('should return an error if there is an internal server error while deleting user', async () => {
			jest.spyOn(usersRepository, 'findOne').mockResolvedValue({
				_eq: '1',
			} as User);
			jest.spyOn(usersRepository, 'delete').mockRejectedValue(
				new Error('error'),
			);

			try {
				await deleteUserService.execute('user-id');
			} catch (e) {
				expect(e.message).toBe(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				);
				expect(e.options.description).toBe(
					'This error occurred when trying to delete the user in the delete-user.service.ts',
				);
			}
		});

		it('should delete the user if everything is fine', async () => {
			jest.spyOn(usersRepository, 'findOne').mockResolvedValue({
				_eq: '1',
			} as User);
			jest.spyOn(usersRepository, 'delete').mockResolvedValue(null);

			await deleteUserService.execute('user-id');
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: {
					_eq: 'user-id',
				},
			});
			expect(usersRepository.delete).toHaveBeenCalledWith({
				_eq: 'user-id',
			});
		});
	});
});
