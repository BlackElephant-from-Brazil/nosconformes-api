import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateUserDTO } from 'src/modules/companies/dtos/req/update-user.dto';
import { User } from '../../users.entity';
import { UpdateUserService } from '../update-user.service';

describe('UpdateUserService', () => {
	let updateUserService: UpdateUserService;

	const mockUsersRepository = {
		findOne: jest.fn(),
		save: jest.fn(),
	};

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateUserService,
				{
					provide: getRepositoryToken(User),
					useValue: mockUsersRepository,
				},
			],
		}).compile();

		updateUserService = moduleRef.get<UpdateUserService>(UpdateUserService);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('execute', () => {
		const mockUserId = '1';
		const mockUpdateUserDTO: UpdateUserDTO = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			office: 'Developer',
			accessLevel: 'auditor',
			profilePicture: 'image.png',
		};

		it('should update an existing user successfully', async () => {
			const mockExistingUser = {
				id: '1',
				name: 'Jane Doe',
				email: 'jane.doe@example.com',
				office: 'Tester',
				accessLevel: 'Admin',
				profilePicture: 'avatar.png',
			};
			mockUsersRepository.findOne.mockResolvedValue(mockExistingUser);
			mockUsersRepository.save.mockResolvedValue(mockExistingUser);

			const result = await updateUserService.execute(
				mockUserId,
				mockUpdateUserDTO,
			);

			expect(result).toEqual(mockExistingUser);

			expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
				where: {
					_eq: mockUserId,
				},
			});

			expect(mockUsersRepository.save).toHaveBeenCalledWith({
				...mockExistingUser,
				...mockUpdateUserDTO,
			});
		});

		it('should throw a BadRequestException if the user does not exist', async () => {
			mockUsersRepository.findOne.mockResolvedValue(null);

			await expect(
				updateUserService.execute(mockUserId, mockUpdateUserDTO),
			).rejects.toThrow(
				new BadRequestException(
					'O usuário que você tentou atualizar não é um usuário válido.',
				),
			);

			expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
				where: {
					_eq: mockUserId,
				},
			});
		});

		it('should throw an InternalServerErrorException if the findOne method throws an error', async () => {
			const errorMessage = 'Error finding user';
			mockUsersRepository.findOne.mockRejectedValue(
				new Error(errorMessage),
			);

			await expect(
				updateUserService.execute(mockUserId, mockUpdateUserDTO),
			).rejects.toThrow(
				new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description:
							'This error occurred when trying to update the user in the update-user.service.ts',
					},
				),
			);

			expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
				where: {
					_eq: mockUserId,
				},
			});
		});

		it('should throw an InternalServerErrorException if the save method throws an error', async () => {
			const errorMessage = 'Error saving user';
			const mockExistingUser = {
				id: '1',
				name: 'Jane Doe',
				email: 'jane.doe@example.com',
				office: 'Tester',
				accessLevel: 'Admin',
				profilePicture: 'avatar.png',
			};
			mockUsersRepository.findOne.mockResolvedValue(mockExistingUser);
			mockUsersRepository.save.mockRejectedValue(new Error(errorMessage));

			await expect(
				updateUserService.execute(mockUserId, mockUpdateUserDTO),
			).rejects.toThrow(
				new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description:
							'This error occurred when trying to save the user in the update-user.service.ts',
					},
				),
			);

			expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
				where: {
					_eq: mockUserId,
				},
			});
			expect(mockUsersRepository.save).toHaveBeenCalledWith({
				...mockExistingUser,
				...mockUpdateUserDTO,
			});
		});
	});
});
