import { MockType } from 'src/@types/mock.type';
import { Repository } from 'typeorm';

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
	() => ({
		create: jest.fn((data) => data),
		save: jest.fn((data) => data),
		findOneBy: jest.fn((data) => data),
	}),
);
