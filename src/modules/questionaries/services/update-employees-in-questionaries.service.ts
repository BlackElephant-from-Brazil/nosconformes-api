import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questionary } from '../questionary.entity';
import { Employee } from 'src/modules/employees/employee.entity';

@Injectable()
export class UpdateEmployeesInQuestionariesService {
	constructor(
		@InjectRepository(Questionary)
		private questionariesRepository: Repository<Questionary>,
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
	) {}

	async execute(
		employeeId: string,
		questionaryId: string,
		employees: Employee[],
	): Promise<void> {
		let foundEmployee: Employee;
		let foundQuestionary: Questionary;

		try {
			foundEmployee = await this.employeesRepository.findOne({
				where: { _eq: employeeId },
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error fetching employee from database',
				},
			);
		}

		if (!foundEmployee) {
			throw new BadRequestException(
				'Você precisa estar logado com um usuário válido.',
			);
		}

		try {
			foundQuestionary = await this.questionariesRepository.findOne({
				where: { _eq: questionaryId },
				relations: {
					employees: true,
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

		if (!foundQuestionary) {
			throw new BadRequestException(
				'O questionário que você está tentando atualizar não existe ou foi excluído.',
			);
		}

		foundQuestionary.employees = [...employees];

		try {
			await this.questionariesRepository.save(foundQuestionary);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error saving questionary in database',
				},
			);
		}
	}
}
