/* eslint-disable @typescript-eslint/no-var-requires */
import { User } from 'src/modules/users/users.entity';
import { ChangePasswordService } from '../services/change-password.service';
import { ChangePasswordController } from './change-password.controller';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { NewPasswordRespDTO } from '../dtos/resp/new-password.resp.dto';
import { NewPasswordReqDTO } from '../dtos/req/new-password.req.dto';
const httpMocks = require('node-mocks-http');

describe('ChangePasswordController', () => {
	let changePasswordController: ChangePasswordController;
	let changePasswordService: ChangePasswordService;
	const mockResponse = httpMocks.createResponse();

	beforeEach(async () => {
		const authModule = await Test.createTestingModule({
			controllers: [ChangePasswordController],
			providers: [ChangePasswordService],
		}).compile();

		changePasswordController = authModule.get<ChangePasswordController>(
			ChangePasswordController,
		);
		changePasswordService = authModule.get<ChangePasswordService>(
			ChangePasswordService,
		);

		describe('changePassword', () => {
			it('should have password and password confirmation as equal as each other', async () => {
				const result: NewPasswordRespDTO = {
					_success: true,
					user: {
						_eq: 'asasas',
						accessLevel: 'asasas',
						email: 'asasas',
						name: 'asasas',
						office: 'asasas',
						profilePicture: 'asasas',
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				};
				jest.spyOn(changePasswordService, 'execute').mockImplementation(
					async () => result,
				);

				const request: NewPasswordReqDTO = {
					_protocol: 'asoaks',
					email: 'asoaks',
					password: 'asoaks',
					passwordConfirmation: 'asoaks',
				};

				expect(
					await changePasswordController.changePassword(
						request,
						mockResponse,
					),
				).toBe(result);
			});
		});
	});
});
