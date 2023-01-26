import { Injectable } from '@nestjs/common';
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
		password,
		office,
		accessLevel,
	}: CreateUserDTO): Promise<User> {
		const hashedPassword = await this.hashProvider.hash({
			password,
		});

		const createdUser = this.usersRepository.create({
			profilePicture,
			name,
			email,
			password: hashedPassword,
			office,
			accessLevel,
		});

		await this.usersRepository.save(createdUser);

		delete createdUser.password;

		return createdUser;
	}
}
