import { Test } from '@nestjs/testing';
import { LoginUserReqDTO } from '../../dtos/req/login-user.req.dto';
import { LoginUserRespDTO } from '../../dtos/resp/login-user.resp.dto';
import { LoginService } from '../../services/login.service';
import { LoginController } from '../login.controller';
import * as mocks from 'node-mocks-http';
import { RequestWithUser } from 'src/interfaces/request-with-user';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('LoginController', () => {
	let loginController: LoginController;
	// let loginMockService: LoginService;

	const loggedUserResult: LoginUserRespDTO = {
		_success: true,
		user: {
			_eq: 'valid-user-id',
			accessLevel: 'manager',
			email: 'valid@email.com',
			name: 'Valid Name',
			office: 'Valid Office',
			profilePicture:
				'https://www.arita.com.br/wp-content/uploads/2020/08/pessoa-expansiva-principais-caracteristicas-desta-personalidade.jpg',
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		accessToken: 'valid-jwt-generated-access-token',
	};

	beforeEach(async () => {
		const authModuleRef = await Test.createTestingModule({
			controllers: [LoginController],
		})
			.useMocker((token) => {
				if (token === LoginService) {
					return {
						execute: jest.fn().mockResolvedValue(loggedUserResult),
					};
				}
				if (typeof token === 'function') {
					const mockMetadata = moduleMocker.getMetadata(
						token,
					) as MockFunctionMetadata<any, any>;
					const Mock =
						moduleMocker.generateFromMetadata(mockMetadata);
					return new Mock();
				}
			})
			.compile();

		loginController = authModuleRef.get<LoginController>(LoginController);
		// loginMockService = authModuleRef.get(LoginService);
	});

	// afterEach(() => {
	// 	jest.restoreAllMocks();
	// 	jest.resetAllMocks();
	// });

	it('should be able to authenticate a valid user', async () => {
		const loginUser: LoginUserReqDTO = {
			email: 'valid@email.com',
			password: 'V@l1dPassword',
		};

		const request: RequestWithUser = mocks.createRequest();
		request.body = loginUser;

		const response = mocks.createResponse();

		await loginController.login(request, response);

		const data = await response._getData();
		const status = response._getStatusCode();

		expect(data).toBe(201);

		// await loginController.login(req, req.res);

		// const data = req.res._getJSONData();

		// expect(req.res.json).toHaveBeenCalledWith('error');
	});
});
