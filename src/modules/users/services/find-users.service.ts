import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, ILike, Repository } from 'typeorm';
import { User } from '../users.entity';

@Injectable()
export class FindUsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async execute(query?: string): Promise<User[]> {
		const resolvedQuery = query ? `%${query}%` : '%%';
		let findUsers: User[];
		try {
			findUsers = await this.usersRepository.find({
				where: [
					{
						accessLevel: ILike(resolvedQuery) as
							| FindOperator<'gestor'>
							| FindOperator<'auditor'>
							| FindOperator<'master'>
							| FindOperator<'consultor'>,
					},
					{
						email: ILike(resolvedQuery),
					},
					{
						name: ILike(resolvedQuery),
					},
					{
						office: ILike(resolvedQuery),
					},
				],
				order: {
					name: 'ASC',
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the users in the find-users.service.ts',
				},
			);
		}

		findUsers.forEach((u) => delete u.password);

		return findUsers;
	}
}
