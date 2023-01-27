import { InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/modules/users/users.entity';
import { BCryptProvider } from 'src/providers/encriptation/bcrypt.provider';
import { Repository } from 'typeorm';
import { LoginUserReqDTO } from '../../dtos/req/login-user.req.dto';
import { LoginService } from '../login.service';

describe('LoginService', () => {
	let loginService: LoginService;
	let usersRepository: Repository<User>;
	let jwtService: JwtService;
	let hashProvider: BCryptProvider;

	beforeEach(async () => {
		const testingModule: TestingModule = await Test.createTestingModule({
			providers: [
				LoginService,
				{
					provide: getRepositoryToken(User),
					useValue: {
						findOne: jest.fn(),
					},
				},
				{
					provide: BCryptProvider,
					useValue: {
						compare: jest.fn(),
					},
				},
				{
					provide: JwtService,
					useValue: {
						sign: jest.fn(),
					},
				},
			],
		}).compile();
		loginService = testingModule.get<LoginService>(LoginService);
		usersRepository = testingModule.get<Repository<User>>(
			getRepositoryToken(User),
		);
		hashProvider = testingModule.get<BCryptProvider>(BCryptProvider);
		jwtService = testingModule.get<JwtService>(JwtService);
	});

	describe('execute', () => {
		it('should return a logged user', async () => {
			const user = new User();
			user.email = 'test@example.com';
			user.password = 'password';
			jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
			jest.spyOn(hashProvider, 'compare').mockResolvedValue(true);
			jest.spyOn(jwtService, 'sign').mockReturnValue('access_token');

			const loginUserReqDTO: LoginUserReqDTO = {
				email: 'test@example.com',
				password: 'password',
			};

			const result = await loginService.execute(loginUserReqDTO);

			expect(result).toEqual({
				user: { email: 'test@example.com' },
				accessToken: 'access_token',
			});
		});

		it('should throw an error if the user is not found', async () => {
			jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

			const loginUserReqDTO: LoginUserReqDTO = {
				email: 'test@example.com',
				password: 'password',
			};

			await expect(
				loginService.execute(loginUserReqDTO),
			).rejects.toThrowError(
				'Email ou senha inválidos. Tente novamente.',
			);
		});

		it('should throw an error if the password is not valid', async () => {
			const user = new User();
			user.email = 'test@example.com';
			user.password = 'password';
			jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
			jest.spyOn(hashProvider, 'compare').mockResolvedValue(false);

			const loginUserReqDTO: LoginUserReqDTO = {
				email: 'test@example.com',
				password: 'wrong_password',
			};

			await expect(
				loginService.execute(loginUserReqDTO),
			).rejects.toThrowError(
				'Email ou senha inválidos. Tente novamente.',
			);
		});

		it('should throw an internal server error if something goes wrong', async () => {
			jest.spyOn(usersRepository, 'findOne').mockRejectedValue(
				new Error('Error'),
			);

			const loginUserReqDTO: LoginUserReqDTO = {
				email: 'test@example.com',
				password: 'password',
			};

			await expect(
				loginService.execute(loginUserReqDTO),
			).rejects.toThrowError(
				new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description: 'Error fetching user from database',
					},
				),
			);
		});

		it('should throw an internal server error if something goes wrong when comparing passwords', async () => {
			const user = new User();
			user.email = 'test@example.com';
			user.password = 'password';
			jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
			jest.spyOn(hashProvider, 'compare').mockRejectedValue(
				new Error('Error'),
			);

			const loginUserReqDTO: LoginUserReqDTO = {
				email: 'test@example.com',
				password: 'password',
			};

			await expect(
				loginService.execute(loginUserReqDTO),
			).rejects.toThrowError(
				new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description: 'Error comparing passwords',
					},
				),
			);
		});

		it('should return a login user response', async () => {
			const user = new User();
			user._eq = '1';
			user.email = 'test@example.com';
			user.password = 'password';
			user.name = 'test';

			jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
			jest.spyOn(hashProvider, 'compare').mockResolvedValue(true);
			jest.spyOn(jwtService, 'sign').mockReturnValue('access_token');

			const loginUserReqDTO: LoginUserReqDTO = {
				email: 'test@example.com',
				password: 'password',
			};

			const response = await loginService.execute(loginUserReqDTO);

			expect(response).toEqual({
				user: {
					_eq: '1',
					name: 'test',
					email: 'test@example.com',
				},
				accessToken: 'access_token',
			});
			expect(response.user).not.toHaveProperty('password');
		});
	});
});
