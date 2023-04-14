import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Question } from '../question.entity';
import { UpdateEmployeesInQuestionsDTO } from '../dtos/update-employees-in-questions.dto';
import { Employee } from 'src/modules/employees/employee.entity';

@Injectable()
export class UpdateEmployeesInQuestionsService {
	constructor(
		@InjectRepository(Question)
		private questionsRepository: Repository<Question>,
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
	) {}

	async execute(
		updaterEmployeeId: string,
		{ questionIds, employees }: UpdateEmployeesInQuestionsDTO,
	): Promise<void> {
		let foundUpdaterEmployee: Employee;
		let questions: Question[] = [];

		try {
			foundUpdaterEmployee = await this.employeesRepository.findOne({
				where: {
					_eq: updaterEmployeeId,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um errro interno no servidor. Por favor, tente novamente ou contate o suporte.',
				{
					description: 'Error on find updater employee',
				},
			);
		}

		if (!foundUpdaterEmployee) {
			throw new BadRequestException(
				'Você precisa estar logado com um funcionário válido.',
			);
		}

		try {
			questions = await this.questionsRepository.find({
				where: {
					_eq: In(questionIds),
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um errro interno no servidor. Por favor, tente novamente ou contate o suporte.',
				{
					description: 'Error on find questions',
				},
			);
		}

		questions.forEach((q) => {
			q.employees = employees;
		});

		try {
			await this.questionsRepository.save(questions);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um errro interno no servidor. Por favor, tente novamente ou contate o suporte.',
				{
					description: 'Error on save questions',
				},
			);
		}
	}
}
