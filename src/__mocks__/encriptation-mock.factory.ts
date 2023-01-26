import { MockType } from 'src/@types/mock.type';
import { EncriptationInterface } from 'src/providers/encriptation/interfaces/encriptation.interface';

export const encriptationMockFactory: () => MockType<EncriptationInterface> =
	jest.fn(() => ({
		compare: jest.fn((data) => data),
		hash: jest.fn((data) => data),
	}));
