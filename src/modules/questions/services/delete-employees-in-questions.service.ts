import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from 'src/modules/employees/employee.entity';

@Injectable()
export class DeleteEmployeesInQuestionsService {
	constructor(
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
	) {}

	async execute(
		employeeId: string,
		deletedEmployeeId: string,
		questionIds: string[],
	): Promise<void> {
		let foundEmployee: Employee;
		let deletedEmployee: Employee;

		try {
			foundEmployee = await this.employeesRepository.findOne({
				where: {
					_eq: employeeId,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um errro interno no servidor. Por favor, tente novamente ou contate o suporte.',
				{
					description: 'Error on find updater employee',
				},
			);
		}

		if (!foundEmployee) {
			throw new BadRequestException(
				'Você precisa estar logado com um funcionário válido.',
			);
		}

		try {
			deletedEmployee = await this.employeesRepository.findOne({
				where: {
					_eq: deletedEmployeeId,
				},
				relations: {
					questions: true,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um errro interno no servidor. Por favor, tente novamente ou contate o suporte.',
				{
					description: 'Error on find deleted employee',
				},
			);
		}

		if (!deletedEmployee) {
			throw new BadRequestException(
				'Você precisa informar um funcionário válido.',
			);
		}

		deletedEmployee.questions = deletedEmployee.questions.filter(
			(q) => !questionIds.includes(q._eq),
		);

		try {
			await this.employeesRepository.save(deletedEmployee);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um errro interno no servidor. Por favor, tente novamente ou contate o suporte.',
				{
					description: 'Error on save deleted employee',
				},
			);
		}
	}
}
