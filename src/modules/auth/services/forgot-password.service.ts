import { MailerService } from '@nestjs-modules/mailer';
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ForgotPasswordService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
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

		// TODO: CREATE _PROTOCOL LOGIC

		try {
			await this.mailerService.sendMail({
				to: email,
				from: 'contato@blackelephant.com.br',
				subject: 'Recupere sua senha',
				html: `<h3 style="color: red">Bem vindx!</h3>`,
			});
		} catch (err) {
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
