import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { FindUserByIdService } from '../find-user-by-id.service';
import { User } from '../../users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('FindUserByIdService', () => {
	let findUserByIdService: FindUserByIdService;
	let usersRepository: Repository<User>;

	beforeEach(async () => {
		const testingModule: TestingModule = await Test.createTestingModule({
			providers: [
				FindUserByIdService,
				{
					provide: getRepositoryToken(User),
					useValue: {
						findOne: jest.fn(),
					},
				},
			],
		}).compile();

		findUserByIdService =
			testingModule.get<FindUserByIdService>(FindUserByIdService);
		usersRepository = testingModule.get<Repository<User>>(
			getRepositoryToken(User),
		);
	});

	it('should be defined', () => {
		expect(findUserByIdService).toBeDefined();
	});

	describe('execute', () => {
		it('should throw bad request exception if user is not found', async () => {
			jest.spyOn(usersRepository, 'findOne').mockResolvedValue(undefined);
			await expect(
				findUserByIdService.execute('user-id'),
			).rejects.toThrowError(BadRequestException);
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: {
					_eq: 'user-id',
				},
			});
		});

		it('should throw internal server error exception if an error occurs', async () => {
			jest.spyOn(usersRepository, 'findOne').mockRejectedValue(
				new Error(),
			);
			await expect(
				findUserByIdService.execute('user-id'),
			).rejects.toThrowError(InternalServerErrorException);
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: {
					_eq: 'user-id',
				},
			});
		});

		it('should return the user if found', async () => {
			const user = new User();
			jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
			const result = await findUserByIdService.execute('user-id');
			expect(result).toBe(user);
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: {
					_eq: 'user-id',
				},
			});
		});
	});
});
