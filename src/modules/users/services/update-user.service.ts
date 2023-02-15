import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDTO } from 'src/modules/companies/dtos/req/update-user.dto';
import { Repository } from 'typeorm';
import { User } from '../users.entity';

@Injectable()
export class UpdateUserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}
	async execute(userId: string, userData: UpdateUserDTO): Promise<User> {
		// TODO: IF RECEIVE THE PASSWORD, VALIDATE AND HASH IT TO SAVE IN THE DATABASE
		let findUser: User;
		try {
			findUser = await this.usersRepository.findOne({
				where: {
					_eq: userId,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to update the user in the update-user.service.ts',
				},
			);
		}

		if (!findUser) {
			throw new BadRequestException(
				'O usuário que você tentou atualizar não é um usuário válido.',
			);
		}

		findUser.name = userData.name;
		findUser.email = userData.email;
		findUser.office = userData.office;
		findUser.accessLevel = userData.accessLevel;
		findUser.profilePicture = userData.profilePicture;

		try {
			await this.usersRepository.save(findUser);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to save the user in the update-user.service.ts',
				},
			);
		}

		return findUser;
	}
}
