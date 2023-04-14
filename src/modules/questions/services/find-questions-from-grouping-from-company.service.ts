import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/modules/employees/employee.entity';
import { Repository } from 'typeorm';
import { Question } from '../question.entity';

@Injectable()
export class FindQuestionsFromGroupingFromCompanyService {
	constructor(
		@InjectRepository(Question)
		private questionsRepository: Repository<Question>,
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
	) {}

	async execute(groupingId: string, employeeId: string): Promise<Question[]> {
		let employee: Employee;
		let questions: Question[];

		try {
			employee = await this.employeesRepository.findOne({
				where: { _eq: employeeId },
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the employee in the find-questions-from-grouping-from-company service.',
				},
			);
		}

		if (!employee) {
			throw new BadRequestException(
				'Você precisa estar logadoo com um usuário válido.',
			);
		}

		try {
			questions = await this.questionsRepository.find({
				where: {
					groupings: {
						_eq: groupingId,
					},
				},
				relations: {
					employees: true,
				},
			});
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the questions in the find-questions-from-grouping-from-company service.',
				},
			);
		}

		return questions;
	}
}
