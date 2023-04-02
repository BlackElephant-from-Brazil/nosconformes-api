import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users.entity';
import * as fs from 'fs';

@Injectable()
export class DeleteUserPhotoService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async execute(userId: string) {
		let foundUser: User;
		try {
			foundUser = await this.usersRepository.findOne({
				where: {
					_eq: userId,
				},
			});
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error while trying to get user by id',
				},
			);
		}

		if (!foundUser) {
			throw new BadRequestException(
				'Não foi possível encontrar o usuário.',
			);
		}

		if (!foundUser.profilePicture) {
			const filename = foundUser.profilePicture.split('uploads/')[1];
			fs.unlinkSync(`uploads/${filename}`);
		}

		foundUser.profilePicture = '';

		try {
			await this.usersRepository.save(foundUser);
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error while trying to save company',
				},
			);
		}
	}
}
