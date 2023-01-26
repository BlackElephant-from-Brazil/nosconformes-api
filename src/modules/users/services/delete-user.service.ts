import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users.entity';

@Injectable()
export class DeleteUserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}
	async execute(userId: string): Promise<void> {
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
						'This error occurred when trying to find the user in the delete-user.service.ts',
				},
			);
		}

		if (!findUser) {
			throw new BadRequestException(
				'O usuário que você buscou não é um usuário válido.',
			);
		}

		try {
			await this.usersRepository.delete({
				_eq: userId,
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to delete the user in the delete-user.service.ts',
				},
			);
		}

		return;
	}
}
