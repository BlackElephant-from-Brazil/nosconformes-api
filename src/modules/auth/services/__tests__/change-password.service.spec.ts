import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { ChangePasswordService } from '../change-password.service';
import { User } from 'src/modules/users/users.entity';
import { BCryptProvider } from 'src/providers/encriptation/bcrypt.provider';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ChangePasswordService', () => {
	let changePasswordService: ChangePasswordService;
	let mockUsersRepository: Repository<User>;
	let mockHashProvider: BCryptProvider;

	beforeEach(async () => {
		const testingModule: TestingModule = await Test.createTestingModule({
			providers: [
				ChangePasswordService,
				{
					provide: getRepositoryToken(User),
					useValue: {
						findOne: jest.fn(),
						save: jest.fn(),
					},
				},
				{ provide: BCryptProvider, useValue: { hash: jest.fn() } },
			],
		}).compile();

		changePasswordService = testingModule.get<ChangePasswordService>(
			ChangePasswordService,
		);
		mockUsersRepository = testingModule.get<Repository<User>>(
			getRepositoryToken(User),
		);
		mockHashProvider = testingModule.get<BCryptProvider>(BCryptProvider);
	});

	it('should be defined', () => {
		expect(changePasswordService).toBeDefined();
	});

	describe('execute', () => {
		let email: string;
		let password: string;
		let passwordConfirmation: string;
		let user: User;
		let hashedPassword: string;

		beforeEach(() => {
			email = 'test@test.com';
			password = 'password';
			passwordConfirmation = 'password';
			hashedPassword = 'hashedpassword';
			user = new User();
			user._eq = '1';
			user.email = 'test@test.com';
			user.password = 'password';

			(mockUsersRepository.findOne as jest.Mock).mockResolvedValue(user);
			(mockHashProvider.hash as jest.Mock).mockResolvedValue(
				hashedPassword,
			);
		});

		it('should throw BadRequestException if user not found', async () => {
			jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValue(null);
			try {
				await changePasswordService.execute({
					email,
					password,
					passwordConfirmation,
					_protocol: 'http',
				});
			} catch (e) {
				expect(e).toBeInstanceOf(BadRequestException);
				expect(e.message).toBe('O usuário não existe');
			}
		});

		it('should throw BadRequestException if passwords dont match', async () => {
			passwordConfirmation = 'wrongpassword';

			try {
				await changePasswordService.execute({
					email,
					password,
					passwordConfirmation,
					_protocol: 'http',
				});
			} catch (e) {
				expect(e).toBeInstanceOf(BadRequestException);
				expect(e.message).toBe('As senhas não coincidem');
			}
			expect(mockHashProvider.hash).not.toHaveBeenCalled();
		});

		it('should throw BadRequestException if user does not exist', async () => {
			jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValue(null);

			try {
				await changePasswordService.execute({
					email,
					password,
					passwordConfirmation,
					_protocol: 'http',
				});
			} catch (e) {
				expect(e).toBeInstanceOf(BadRequestException);
				expect(e.message).toBe('O usuário não existe');
			}
		});

		it('should throw InternalServerErrorException if error occurs while fetching user', async () => {
			jest.spyOn(mockUsersRepository, 'findOne').mockRejectedValue(
				new Error('Test Error'),
			);

			try {
				await changePasswordService.execute({
					email,
					password,
					passwordConfirmation,
					_protocol: 'http',
				});
			} catch (e) {
				expect(e).toBeInstanceOf(InternalServerErrorException);
				expect(e.message).toBe(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				);
				expect(e.options).toEqual({
					description: 'Error fetching user from database',
				});
			}
		});

		it('should throw InternalServerErrorException if error occurs while saving user', async () => {
			jest.spyOn(mockUsersRepository, 'save').mockRejectedValue(
				new Error('Test Error'),
			);
			try {
				await changePasswordService.execute({
					email,
					password,
					passwordConfirmation,
					_protocol: 'http',
				});
			} catch (e) {
				expect(e).toBeInstanceOf(InternalServerErrorException);
				expect(e.message).toBe(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				);
				expect(e.options).toEqual({
					description: 'Error saving user to database',
				});
			}
		});

		it('should delete password property from user before returning', async () => {
			const result = await changePasswordService.execute({
				email,
				password,
				passwordConfirmation,
				_protocol: 'http',
			});
			expect(result.user).not.toHaveProperty('password');
		});
	});
});
