import { JwtService } from '@nestjs/jwt';
import { MockType } from 'src/@types/mock.type';

export const jwtMockFactory: () => MockType<JwtService> = jest.fn(() => ({
	sign: jest.fn((data) => data),
}));
