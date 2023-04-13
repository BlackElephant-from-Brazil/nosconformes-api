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
export class RemoveEmployeeFromQuestionaryService {
	constructor(
		@InjectRepository(Questionary)
		private questionariesRepository: Repository<Questionary>,
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
	) {}

	async execute(
		employeeId: string,
		questionaryId: string,
		deletedEmployeeId: string,
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

		const foundEmployeeIndex = foundQuestionary.employees.findIndex(
			(employee) => employee._eq === deletedEmployeeId,
		);

		if (foundEmployeeIndex === -1) {
			throw new BadRequestException(
				'O funcionário que você está tentando remover não está associado a este questionário.',
			);
		}

		foundQuestionary.employees.splice(foundEmployeeIndex, 1);

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
