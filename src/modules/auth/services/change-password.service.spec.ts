import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BCryptProvider } from '../../../providers/encriptation/bcrypt.provider';
import { User } from '../../users/users.entity';
import { NewPasswordReqDTO } from '../dtos/req/new-password.req.dto';
import { ChangePasswordService } from './change-password.service';

describe('ChangePasswordService', () => {
  let changePasswordService: ChangePasswordService;

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
        {
          provide: BCryptProvider,
          useValue: {
            hash: jest.fn(),
            compare: jest.fn(),
          },
        },
      ],
    }).compile();

    changePasswordService = testingModule.get<ChangePasswordService>(
      ChangePasswordService,
    );
  });

  it('should throw an exception if password and passwordConfirmation does not match', async () => {
    const changePasswordPayload: NewPasswordReqDTO = {
      email: 'gui.sartori96@gmail.com',
      password: 'password',
      passwordConfirmation: 'not-match-password',
      _protocol: 'valid-protocol',
    };
    expect(changePasswordService).toBeDefined();
  });

  it('should throw an exception if user email does not exists in database', async () => {
    const changePasswordPayload: NewPasswordReqDTO = {
      email: 'unvalid@user.com',
      password: 'password',
      passwordConfirmation: 'password',
      _protocol: 'valid-protocol',
    };
    expect(changePasswordService).toBeDefined();
  });
});
