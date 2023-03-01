import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/users.entity';
import { In, Not, Repository } from 'typeorm';
import { Questionary } from '../questionary.entity';

type UpdateAuditorFromQuestionaryServiceParams = {
	questionaryId: string;
	auditors: User[];
};

@Injectable()
export class UpdateAuditorFromQuestionaryService {
	constructor(
		@InjectRepository(Questionary)
		private questionariesRepository: Repository<Questionary>,
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async execute({
		questionaryId,
		auditors,
	}: UpdateAuditorFromQuestionaryServiceParams): Promise<User[]> {
		let findQuestionary: Questionary;
		let availableUsers: User[];

		try {
			findQuestionary = await this.questionariesRepository.findOne({
				where: { _eq: questionaryId },
				relations: {
					auditors: true,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error fetching questionary from database',
				},
			);
		}

		if (!findQuestionary) {
			throw new BadRequestException(
				'Não foi possível encontrar o questionário solicitado.',
			);
		}

		findQuestionary.auditors = auditors;

		try {
			await this.questionariesRepository.save(findQuestionary);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error saving questionary in database',
				},
			);
		}

		try {
			const auditorsIds = findQuestionary.auditors.map((a) => a._eq);
			availableUsers = await this.usersRepository.find({
				where: [
					{
						accessLevel: 'auditor',
						_eq: Not(In(auditorsIds)),
					},
					{
						accessLevel: 'master',
						_eq: Not(In(auditorsIds)),
					},
				],
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error fetching users from database',
				},
			);
		}

		return availableUsers;
	}
}
