import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Employee } from '../employee.entity';

@Injectable()
export class FindAvailableEmployeesToQuestionaryServcice {
	constructor(
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
	) {}
	async execute(
		employeeId: string,
		questionaryId: string,
	): Promise<Employee[]> {
		let availableEmployees: Employee[];
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
			availableEmployees = await this.employeesRepository
				.createQueryBuilder('employee')
				.leftJoinAndSelect('employee.questionaries', 'questionary')
				.where('employee.companyId = :companyId', {
					companyId: foundEmployee.companyId,
				})
				.andWhere('employee.accessLevel != :accessLevel', {
					accessLevel: 'patrocinador',
				})
				.andWhere((qb) => {
					const subQuery = qb
						.subQuery()
						.select('questionary._eq')
						.from('questionaries', 'questionary')
						.where('questionary._eq = :questionaryId', {
							questionaryId,
						})
						.getQuery();
					return `questionary._eq IS NULL OR questionary._eq NOT IN ${subQuery}`;
				})
				.orderBy('employee.name', 'ASC')
				.getMany();
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the employees in the find-employees.service.ts',
				},
			);
		}

		availableEmployees.forEach((u) => delete u.password);

		console.log('availableEmployees', availableEmployees);

		return availableEmployees;
	}
}
