import { MailerService } from '@nestjs-modules/mailer';
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Protocol } from 'src/modules/protocol/protocol.entity';
import { User } from 'src/modules/users/users.entity';
import { Repository } from 'typeorm';
import handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ForgotPasswordService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		@InjectRepository(Protocol)
		private protocolsRepository: Repository<Protocol>,
		private mailerService: MailerService,
	) {}

	async execute(email: string) {
		let user: User;
		try {
			user = await this.usersRepository.findOne({
				where: {
					email,
				},
			});
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error fetching user from database',
				},
			);
		}

		if (!user) throw new BadRequestException('O usuário não existe');

		let protocol: Protocol;
		// TODO: INSERT NEW PROTOCOL AS GENERATED MD5
		try {
			const createdProtocol = this.protocolsRepository.create({
				userId: user._eq,
				_protocol: '123456',
			});
			protocol = await this.protocolsRepository.save(createdProtocol);
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error creating protocol',
				},
			);
		}

		// TODO: REMOVE HANDLEBARS FROM SERVICE
		const view = fs.readFileSync(
			path.resolve(
				__dirname,
				'..',
				'..',
				'..',
				'..',
				'templates',
				'change-password.mail.hbs',
			),
			'utf8',
		);

		const template = handlebars.compile(view);
		const html = template({
			_protocol: protocol._protocol,
			email,
		});

		try {
			await this.mailerService.sendMail({
				to: email,
				from: 'contato@blackelephant.com.br',
				subject: 'Recupere sua senha',
				html: html,
			});
		} catch (err) {
			console.log(err);
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error sending email',
				},
			);
		}

		return;
	}
}
