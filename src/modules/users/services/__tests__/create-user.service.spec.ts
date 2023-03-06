import { Test, TestingModule } from '@nestjs/testing';
import { BCryptProvider } from 'src/providers/encriptation/bcrypt.provider';
import { InternalServerErrorException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserService } from '../create-user.service';
import { User } from '../../users.entity';
import { CreateUserDTO } from '../../dtos/create-user.dto';

describe('CreateUserService', () => {
	let createUserService: CreateUserService;

	const mockUsersRepository = {
		create: jest.fn(),
		save: jest.fn(),
	};

	const mockBcryptProvider = {
		hash: jest.fn(),
	};

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				CreateUserService,
				{
					provide: getRepositoryToken(User),
					useValue: mockUsersRepository,
				},
				{
					provide: BCryptProvider,
					useValue: mockBcryptProvider,
				},
			],
		}).compile();

		createUserService = moduleRef.get<CreateUserService>(CreateUserService);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('execute', () => {
		const mockCreateUserDTO: CreateUserDTO = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			office: 'Developer',
			accessLevel: 'auditor',
			profilePicture: 'image.png',
		};

		const mockHash = '123abc';

		it('should create a new user successfully', async () => {
			mockBcryptProvider.hash.mockResolvedValue(mockHash);

			const mockCreatedUser = {
				...mockCreateUserDTO,
				password: mockHash,
			};

			mockUsersRepository.create.mockReturnValue(mockCreatedUser);

			const mockSavedUser = {
				...mockCreatedUser,
				id: '1',
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			mockUsersRepository.save.mockResolvedValue(mockSavedUser);

			const result = await createUserService.execute(mockCreateUserDTO);

			expect(result).toEqual({
				...mockCreateUserDTO,
				id: mockSavedUser.id,
				createdAt: mockSavedUser.createdAt,
				updatedAt: mockSavedUser.updatedAt,
			});

			expect(mockBcryptProvider.hash).toHaveBeenCalledWith({
				password: '123456',
			});

			expect(mockUsersRepository.create).toHaveBeenCalledWith({
				...mockCreateUserDTO,
				password: mockHash,
			});

			expect(mockUsersRepository.save).toHaveBeenCalledWith(
				mockCreatedUser,
			);
		});

		it('should throw an InternalServerErrorException if the save method throws an error', async () => {
			mockBcryptProvider.hash.mockResolvedValue(mockHash);

			const mockCreatedUser = {
				...mockCreateUserDTO,
				password: mockHash,
			};

			mockUsersRepository.create.mockReturnValue(mockCreatedUser);

			const errorMessage = 'Error saving user';
			mockUsersRepository.save.mockRejectedValue(new Error(errorMessage));

			await expect(
				createUserService.execute(mockCreateUserDTO),
			).rejects.toThrow(
				new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description:
							'This error occurred when trying to save the user in the create-user.service.ts',
					},
				),
			);
		});
	});
});
