import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/users.entity';
import { BCryptProvider } from '../../../providers/encriptation/bcrypt.provider';
import { Repository } from 'typeorm';
import { NewPasswordReqDTO } from '../dtos/req/new-password.req.dto';
import { NewPasswordRespDTO } from '../dtos/resp/new-password.resp.dto';

@Injectable()
export class ChangePasswordService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		private hashProvider: BCryptProvider,
	) {}

	async execute({
		email,
		password,
		passwordConfirmation,
	}: NewPasswordReqDTO): Promise<NewPasswordRespDTO> {
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

		if (password !== passwordConfirmation)
			throw new BadRequestException('As senhas não coincidem');

		let hashedPassword: string;

		try {
			hashedPassword = await this.hashProvider.hash({
				password,
			});
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error hashing password',
				},
			);
		}

		user.password = hashedPassword;

		try {
			await this.usersRepository.save(user);
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error saving user to database',
				},
			);
		}

		delete user.password;

		return {
			user,
		};
	}
}
