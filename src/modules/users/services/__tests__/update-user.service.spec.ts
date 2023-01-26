import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateUserDTO } from 'src/modules/companies/dtos/req/update-user.dto';
import { UpdateUserService } from '../update-user.service';
import { User } from '../../users.entity';

describe('UpdateUserService', () => {
	let service: UpdateUserService;
	let repository: Repository<User>;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				UpdateUserService,
				{
					provide: getRepositoryToken(User),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<UpdateUserService>(UpdateUserService);
		repository = module.get<Repository<User>>(getRepositoryToken(User));
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('execute', () => {
		it('should update user', async () => {
			const user = new User();
			user._eq = '1';
			user.name = 'John Doe';
			user.email = 'johndoe@example.com';
			user.office = 'New York';
			user.accessLevel = 'auditor';
			user.profilePicture = 'https://example.com/john-doe.jpg';
			jest.spyOn(repository, 'findOne').mockImplementation(() =>
				Promise.resolve(user),
			);
			jest.spyOn(repository, 'save').mockImplementation(() =>
				Promise.resolve(user),
			);

			const userData: UpdateUserDTO = {
				name: 'Jane Doe',
				email: 'janedoe@example.com',
				office: 'Los Angeles',
				accessLevel: 'auditor',
				profilePicture: 'https://example.com/jane-doe.jpg',
			};

			const updatedUser = await service.execute(user._eq, userData);

			expect(updatedUser.name).toBe('Jane Doe');
			expect(updatedUser.email).toBe('janedoe@example.com');
			expect(updatedUser.office).toBe('Los Angeles');
			expect(updatedUser.accessLevel).toBe('auditor');
			expect(updatedUser.profilePicture).toBe(
				'https://example.com/jane-doe.jpg',
			);
			expect(repository.findOne).toHaveBeenCalledWith({
				where: {
					_eq: user._eq,
				},
			});
			expect(repository.save).toHaveBeenCalledWith(updatedUser);
		});
	});
});
