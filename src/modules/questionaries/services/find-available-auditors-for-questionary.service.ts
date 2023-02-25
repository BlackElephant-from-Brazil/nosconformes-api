import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/users.entity';
import { In, Not, Repository } from 'typeorm';
import { Questionary } from '../questionary.entity';

@Injectable()
export class FindAvailableAuditorsForQuestionaryService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		@InjectRepository(Questionary)
		private questionariesRepository: Repository<Questionary>,
	) {}

	async execute(questionaryId: string): Promise<User[]> {
		let findUsers: User[];
		let findQuestionary: Questionary;

		try {
			findQuestionary = await this.questionariesRepository.findOne({
				where: {
					_eq: questionaryId,
				},
				relations: {
					auditors: true,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the questionaries in the find-available-auditors-for-questionary.service.ts',
				},
			);
		}

		if (!findQuestionary) {
			throw new BadRequestException(
				'Não foi possível encontrar o questionário solicitado.',
			);
		}

		try {
			const auditorsIds = findQuestionary.auditors.map((a) => a._eq);
			findUsers = await this.usersRepository.find({
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
					description:
						'This error occurred when trying to find the users in the find-available-auditors-for-questionary.service.ts',
				},
			);
		}

		return findUsers;
	}
}
