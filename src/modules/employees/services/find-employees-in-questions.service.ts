import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Employee } from '../employee.entity';

@Injectable()
export class FindEmployeesInQuestionsService {
	constructor(
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
	) {}
	async execute(
		employeeId: string,
		questionIds: string[],
	): Promise<Employee[]> {
		let foundEmployee: Employee;
		let employeesInQuestions: Employee[];
		try {
			foundEmployee = await this.employeesRepository.findOne({
				where: { _eq: employeeId },
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error on find employee by id',
				},
			);
		}

		if (!foundEmployee) {
			throw new BadRequestException(
				'Você precisa estar logado com um usuário válido para executar essa ação.',
			);
		}

		try {
			employeesInQuestions = await this.employeesRepository.find({
				where: {
					questions: {
						_eq: In(questionIds),
					},
				},
			});
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error on find employees in questions',
				},
			);
		}

		return employeesInQuestions;
	}
}
