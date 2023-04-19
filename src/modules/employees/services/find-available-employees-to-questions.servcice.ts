import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Raw, Repository } from 'typeorm';
import { Employee } from '../employee.entity';

@Injectable()
export class FindAvailableEmployeesToQuestionsServcice {
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
			employeesInQuestions = await this.employeesRepository
				.createQueryBuilder('employee')
				.leftJoin('employee.questions', 'questions')
				.where(
					`NOT EXISTS (SELECT 1
						FROM questions q
						LEFT JOIN questions_employees qe ON qe.question_id = q._eq
						LEFT JOIN employees e ON e._eq = qe.employee_id
						WHERE 
						qe.question_id = ALL(:questionIds)
					)`,
				)
				.andWhere('employee.accessLevel != :accessLevel', {
					accessLevel: 'patrocinador',
				})
				.setParameters({ questionIds })
				.getMany();
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error on find employees in questions',
				},
			);
		}

		console.log(employeesInQuestions);

		return employeesInQuestions;
	}
}
