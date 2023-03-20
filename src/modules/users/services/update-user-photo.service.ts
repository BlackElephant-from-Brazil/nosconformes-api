import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { User } from '../users.entity';

@Injectable()
export class UpdateUserPhotoService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async execute(userId: string, photoPath: string): Promise<string> {
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
				'Não foi possível encontrar a empresa com o id informado.',
			);
		}

		if (foundUser.profilePicture) {
			const filename = foundUser.profilePicture.split('uploads/')[1];
			fs.unlinkSync(`uploads/${filename}`);
		}

		foundUser.profilePicture = `${process.env.BASE_URL}:${
			process.env.PORT || 3333
		}/${photoPath}`;

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

		return foundUser.profilePicture;
	}
}
