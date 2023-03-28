import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateEmployeeDTO } from '../dtos/update-employee.dto';
import { Employee } from '../employee.entity';

@Injectable()
export class UpdateEmployeeService {
	constructor(
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
	) {}
	async execute(
		updateEmployeeDTO: UpdateEmployeeDTO,
		employeeId: string,
	): Promise<void> {
		let foundEmployee: Employee;
		try {
			foundEmployee = await this.employeesRepository.findOne({
				where: { _eq: employeeId },
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the employee in the update-employee.service.ts',
				},
			);
		}

		if (!foundEmployee) {
			throw new BadRequestException(
				'Você precisa estar logado com um usuário válido para atualizar seus dados.',
			);
		}

		foundEmployee.name = updateEmployeeDTO.name;
		foundEmployee.email = updateEmployeeDTO.email;
		foundEmployee.office = updateEmployeeDTO.office;
		foundEmployee.accessLevel = updateEmployeeDTO.accessLevel;

		try {
			await this.employeesRepository.save(foundEmployee);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to save the employee in the update-employee.service.ts',
				},
			);
		}
	}
}
