import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BCryptProvider } from 'src/providers/encriptation/bcrypt.provider';
import { Repository } from 'typeorm';
import { User } from '../users.entity';

@Injectable()
export class CreateMainUserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		private hashProvider: BCryptProvider,
	) {}

	async execute(): Promise<User> {
		const defaultPassword = 'Bl@ck3l3ph4n7';
		const hashedPesword = await this.hashProvider.hash({
			password: defaultPassword,
		});
		const createdUser = this.usersRepository.create({
			name: 'Administrador BlackElephant',
			email: 'admin@blackelephant.com.br',
			password: hashedPesword,
			accessLevel: 'master',
			phone: '19971100867',
			office: 'Administrador',
			profilePicture:
				'https://media.licdn.com/dms/image/D4D0BAQFY26dOuKzurQ/company-logo_200_200/0/1680358014371?e=1688601600&v=beta&t=q_gITO7NxMcSIlFkOAgtwpyVR8BQ4QxLJSEV3tLIxYE',
		});

		let savedUser: User;

		try {
			savedUser = await this.usersRepository.save(createdUser);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to save the user in the create-user.service.ts',
				},
			);
		}

		delete createdUser.password;
		delete savedUser.password;

		return savedUser;
	}
}
