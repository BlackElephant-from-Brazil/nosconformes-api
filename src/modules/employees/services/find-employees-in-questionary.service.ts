import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../employee.entity';

@Injectable()
export class FindEmployeesInQuestionaryService {
	constructor(
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
	) {}
	async execute(
		employeeId: string,
		questionaryId: string,
	): Promise<Employee[]> {
		let currentEmployees: Employee[];
		let foundEmployee: Employee;

		try {
			foundEmployee = await this.employeesRepository.findOne({
				where: {
					_eq: employeeId,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the employee in the find-employees.service.ts',
				},
			);
		}

		if (!foundEmployee) {
			throw new BadRequestException(
				'Você não é um usuário válido para esta operação.',
			);
		}

		try {
			currentEmployees = await this.employeesRepository.find({
				where: {
					companyId: foundEmployee.companyId,
					questionaries: {
						_eq: questionaryId,
					},
				},
				relations: {
					questionaries: true,
				},
				order: {
					name: 'ASC',
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the employees in the find-employees.service.ts',
				},
			);
		}

		currentEmployees.forEach((u) => delete u.password);

		return currentEmployees;
	}
}
