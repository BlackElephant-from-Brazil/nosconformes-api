import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDTO } from '../dtos/create-employee.dto';
import { Employee } from '../employee.entity';

@Injectable()
export class CreateEmployeeService {
	constructor(
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
	) {}
	async execute(
		createEmployeeDTO: CreateEmployeeDTO,
		employeeId: string,
	): Promise<Employee> {
		let foundEmployee: Employee;
		try {
			foundEmployee = await this.employeesRepository.findOne({
				where: {
					_eq: employeeId,
				},
			});
		} catch (err) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the employee in the create-employee.service.ts',
				},
			);
		}

		if (!foundEmployee) {
			throw new BadRequestException(
				'Você precisa ser um usuário válido para realizar esta ação.',
			);
		}

		const createdEmployee = this.employeesRepository.create({
			...createEmployeeDTO,
			companyId: foundEmployee.companyId,
			department: 'teste',
		});

		try {
			await this.employeesRepository.save(createdEmployee);
		} catch (err) {
			console.log(err);
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to save the employee in the create-employee.service.ts',
				},
			);
		}

		return createdEmployee;
	}
}
