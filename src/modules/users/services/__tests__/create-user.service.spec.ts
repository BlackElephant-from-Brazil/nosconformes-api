import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users.entity';
import { CreateUserService } from '../create-user.service';

describe('CreateUserService', () => {
	let createUserService: CreateUserService;
	let usersRepository: Repository<User>;

	beforeEach(async () => {
		const testingModule = await Test.createTestingModule({
			providers: [
				CreateUserService,
				{
					provide: getRepositoryToken(User),
					useValue: {
						create: jest.fn(),
						save: jest.fn(),
					},
				},
			],
		}).compile();

		createUserService =
			testingModule.get<CreateUserService>(CreateUserService);
		usersRepository = testingModule.get<Repository<User>>(
			getRepositoryToken(User),
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(createUserService).toBeDefined();
	});

	describe('execute', () => {
		it('should throw internal server error exception if an error occurs while trying to save the user', async () => {
			jest.spyOn(usersRepository, 'create').mockReturnValue({
				name: 'John Doe',
				email: 'johndoe@email.com',
				accessLevel: 'auditor',
				office: 'office',
				profilePicture: 'profile-picture',
			} as User);
			jest.spyOn(usersRepository, 'save').mockRejectedValue(new Error());

			await expect(
				createUserService.execute({
					name: 'John Doe',
					email: 'johndoe@email.com',
					accessLevel: 'auditor',
					office: 'office',
					profilePicture: 'profile-picture',
				}),
			).rejects.toThrowError(InternalServerErrorException);
			expect(usersRepository.save).toHaveBeenCalledWith({
				name: 'John Doe',
				email: 'johndoe@email.com',
				accessLevel: 'auditor',
				office: 'office',
				profilePicture: 'profile-picture',
			});
		});

		it('should return the created user if everythin looks great', async () => {
			jest.spyOn(usersRepository, 'create').mockReturnValue({
				name: 'John Doe',
				email: 'johndoe@email.com',
				accessLevel: 'auditor',
				office: 'office',
				profilePicture: 'profile-picture',
			} as User);

			jest.spyOn(usersRepository, 'save').mockResolvedValue({
				name: 'John Doe',
				email: 'johndoe@email.com',
				accessLevel: 'auditor',
				office: 'office',
				profilePicture: 'profile-picture',
			} as User);

			const user = await createUserService.execute({
				name: 'John Doe',
				email: 'johndoe@email.com',
				accessLevel: 'auditor',
				office: 'office',
				profilePicture: 'profile-picture',
			});
			expect(user).toEqual({
				name: 'John Doe',
				email: 'johndoe@email.com',
				accessLevel: 'auditor',
				office: 'office',
				profilePicture: 'profile-picture',
			});
			expect(usersRepository.save).toHaveBeenCalledWith({
				name: 'John Doe',
				email: 'johndoe@email.com',
				accessLevel: 'auditor',
				office: 'office',
				profilePicture: 'profile-picture',
			});
		});
	});
});
