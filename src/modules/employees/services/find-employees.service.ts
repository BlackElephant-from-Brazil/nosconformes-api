import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, ILike, Repository } from 'typeorm';
import { Employee } from '../employee.entity';

@Injectable()
export class FindEmployeesService {
	constructor(
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
	) {}
	async execute(query: string, employeeId: string): Promise<Employee[]> {
		const resolvedQuery = query ? `%${query}%` : '%%';
		let findEmployees: Employee[];
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
						'This error occurred when trying to find the employee in the find-employees.service.ts',
				},
			);
		}

		if (!findEmployee) {
			throw new BadRequestException(
				'Você não é um usuário válido para esta operação.',
			);
		}

		try {
			findEmployees = await this.employeesRepository.find({
				where: [
					{
						accessLevel: ILike(resolvedQuery) as
							| FindOperator<'patrocinador'>
							| FindOperator<'stackholder'>,
					},
					{
						email: ILike(resolvedQuery),
					},
					{
						name: ILike(resolvedQuery),
					},
					{
						office: ILike(resolvedQuery),
					},
					{
						companyId: findEmployee.companyId,
					},
				],
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

		findEmployees.forEach((u) => delete u.password);

		return findEmployees;
	}
}
