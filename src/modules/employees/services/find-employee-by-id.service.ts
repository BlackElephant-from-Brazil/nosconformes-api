import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../employee.entity';

@Injectable()
export class FindEmployeeByIdService {
	constructor(
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
	) {}
	async execute(employeeId: string): Promise<Employee> {
		let findEmployee: Employee;
		try {
			findEmployee = await this.employeesRepository.findOne({
				where: {
					_eq: employeeId,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the employee in the find-employee-by-id.service.ts',
				},
			);
		}

		if (!findEmployee) {
			throw new BadRequestException(
				'O funcionário que você buscou não é um funcionário válido.',
			);
		}

		delete findEmployee.password;

		return findEmployee;
	}
}
