import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BCryptProvider } from 'src/providers/encriptation/bcrypt.provider';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { User } from '../users.entity';

@Injectable()
export class CreateUserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		private hashProvider: BCryptProvider,
	) {}

	async execute({
		profilePicture,
		name,
		email,
		office,
		accessLevel,
	}: CreateUserDTO): Promise<User> {
		const defaultPassword = '123456';
		const hashadPesword = await this.hashProvider.hash({
			password: defaultPassword,
		});
		const createdUser = this.usersRepository.create({
			profilePicture,
			name,
			email,
			office,
			accessLevel,
			password: hashadPesword,
		});

		try {
			await this.usersRepository.save(createdUser);
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

		return createdUser;
	}
}
