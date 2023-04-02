import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../employee.entity';
import * as fs from 'fs';

@Injectable()
export class DeleteEmployeePhotoService {
	constructor(
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
	) {}
	async execute(employeeId: string): Promise<void> {
		let foundEmployee: Employee;
		try {
			foundEmployee = await this.employeesRepository.findOne({
				where: {
					_eq: employeeId,
				},
			});
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error while trying to get employee by id',
				},
			);
		}

		if (!foundEmployee) {
			throw new BadRequestException(
				'Não foi possível encontrar o usuário.',
			);
		}

		if (!foundEmployee.profilePicture) {
			const filename = foundEmployee.profilePicture.split('uploads/')[1];
			fs.unlinkSync(`uploads/${filename}`);
		}

		foundEmployee.profilePicture = '';

		try {
			await this.employeesRepository.save(foundEmployee);
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error while trying to save employee',
				},
			);
		}
	}
}
