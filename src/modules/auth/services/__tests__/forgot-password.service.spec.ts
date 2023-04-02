import { Test, TestingModule } from '@nestjs/testing';
import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { Protocol } from 'src/modules/protocol/protocol.entity';
import { User } from 'src/modules/users/users.entity';
import { ForgotPasswordService } from '../forgot-password.service';

describe('ForgotPasswordService', () => {
	let service: ForgotPasswordService;
	let usersRepository: jest.Mocked<Record<keyof Repository<User>, jest.Mock>>;
	let protocolsRepository: jest.Mocked<
		Record<keyof Repository<Protocol>, jest.Mock>
	>;
	let mailerService: jest.Mocked<Record<keyof MailerService, jest.Mock>>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ForgotPasswordService,
				{
					provide: 'UserRepository',
					useClass: Repository,
				},
				{
					provide: 'ProtocolRepository',
					useClass: Repository,
				},
				{
					provide: MailerService,
					useValue: {
						sendMail: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<ForgotPasswordService>(ForgotPasswordService);
		usersRepository = module.get('UserRepository');
		protocolsRepository = module.get('ProtocolRepository');
		mailerService = module.get(MailerService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		const email = 'test@example.com';

		beforeEach(() => {
			jest.spyOn(usersRepository, 'findOne');
			jest.spyOn(protocolsRepository, 'create');
			jest.spyOn(protocolsRepository, 'save');
		});

		it('should throw BadRequestException if user does not exist', async () => {
			usersRepository.findOne.mockResolvedValueOnce(undefined);

			await expect(service.execute(email)).rejects.toThrow(
				BadRequestException,
			);
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { email },
			});
			expect(protocolsRepository.create).not.toHaveBeenCalled();
			expect(protocolsRepository.save).not.toHaveBeenCalled();
			expect(mailerService.sendMail).not.toHaveBeenCalled();
		});

		it('should create a protocol, generate email HTML, and send an email', async () => {
			const user = new User();
			user._eq = '1';
			user.email = email;

			const createdProtocol = new Protocol();
			createdProtocol._eq = '1';
			createdProtocol._protocol = '123456';
			createdProtocol.userId = user._eq;

			usersRepository.findOne.mockResolvedValueOnce(user);
			protocolsRepository.create.mockReturnValueOnce(createdProtocol);
			protocolsRepository.save.mockResolvedValueOnce(createdProtocol);

			await service.execute(email);

			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { email },
			});
			expect(protocolsRepository.create).toHaveBeenCalledWith({
				userId: user._eq,
				_protocol: expect.any(String),
			});
			expect(protocolsRepository.save).toHaveBeenCalledWith(
				createdProtocol,
			);

			expect(mailerService.sendMail).toHaveBeenCalledWith({
				to: email,
				from: 'contato@blackelephant.com.br',
				subject: 'Recupere sua senha',
				html: expect.any(String),
			});
		});

		it('should throw InternalServerErrorException if there is an error fetching the user from the database', async () => {
			usersRepository.findOne.mockRejectedValueOnce(
				new Error('DB connection failed'),
			);

			await expect(service.execute(email)).rejects.toThrow(
				InternalServerErrorException,
			);
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { email },
			});
			expect(protocolsRepository.create).not.toHaveBeenCalled();
			expect(protocolsRepository.save).not.toHaveBeenCalled();
			expect(mailerService.sendMail).not.toHaveBeenCalled();
		});

		it('should throw InternalServerErrorException if there is an error creating a protocol', async () => {
			const user = new User();
			user._eq = '1';
			user.email = email;

			usersRepository.findOne.mockResolvedValueOnce(user);
			protocolsRepository.create.mockReturnValueOnce(
				new Error('Error creating protocol'),
			);

			await expect(service.execute(email)).rejects.toThrow(
				InternalServerErrorException,
			);
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { email },
			});
			expect(protocolsRepository.create).toHaveBeenCalledWith({
				userId: user._eq,
				_protocol: expect.any(String),
			});
			expect(protocolsRepository.save).not.toHaveBeenCalled();
			expect(mailerService.sendMail).not.toHaveBeenCalled();
		});

		it('should throw InternalServerErrorException if there is an error saving a protocol', async () => {
			const user = new User();
			user._eq = '1';
			user.email = email;

			const createdProtocol = new Protocol();
			createdProtocol._eq = '1';
			createdProtocol._protocol = '123456';
			createdProtocol.userId = user._eq;

			usersRepository.findOne.mockResolvedValueOnce(user);
			protocolsRepository.create.mockReturnValueOnce(createdProtocol);
			protocolsRepository.save.mockRejectedValueOnce(
				new Error('Error saving protocol'),
			);

			await expect(service.execute(email)).rejects.toThrow(
				InternalServerErrorException,
			);
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { email },
			});
			expect(protocolsRepository.create).toHaveBeenCalledWith({
				userId: user._eq,
				_protocol: expect.any(String),
			});
			expect(protocolsRepository.save).toHaveBeenCalledWith(
				createdProtocol,
			);
			expect(mailerService.sendMail).not.toHaveBeenCalled();
		});

		it('should throw InternalServerErrorException if there is an error sending an email', async () => {
			const user = new User();
			user._eq = '1';
			user.email = email;

			const createdProtocol = new Protocol();
			createdProtocol._eq = '1';
			createdProtocol._protocol = '123456';
			createdProtocol.userId = user._eq;

			usersRepository.findOne.mockResolvedValueOnce(user);
			protocolsRepository.create.mockReturnValueOnce(createdProtocol);
			protocolsRepository.save.mockResolvedValueOnce(createdProtocol);
			mailerService.sendMail.mockRejectedValueOnce(
				new Error('Error sending email'),
			);

			await expect(service.execute(email)).rejects.toThrow(
				InternalServerErrorException,
			);
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { email },
			});
			expect(protocolsRepository.create).toHaveBeenCalledWith({
				userId: user._eq,
				_protocol: expect.any(String),
			});
			expect(protocolsRepository.save).toHaveBeenCalledWith(
				createdProtocol,
			);
			expect(mailerService.sendMail).toHaveBeenCalledWith({
				to: email,
				from: 'contato@blackelephant.com.br',
				subject: 'Recupere sua senha',
				html: expect.any(String),
			});
		});
	});
});
