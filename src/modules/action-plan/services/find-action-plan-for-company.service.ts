import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/modules/employees/employee.entity';
import { Questionary } from 'src/modules/questionaries/questionary.entity';
import { Question } from 'src/modules/questions/question.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class FindActionPlanForCompanyService {
	constructor(
		@InjectRepository(Question)
		private questionsRepository: Repository<Question>,
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
		@InjectRepository(Questionary)
		private questionariesRepository: Repository<Questionary>,
	) {}

	async execute(employeeId: string): Promise<Question[]> {
		let employee: Employee;
		let questionaries: Questionary[];
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
						'This error occurred when trying to find the employee in the find-action-plan-for-company service.',
				},
			);
		}

		if (!employee) {
			throw new BadRequestException(
				'Você precisa estar logado com um usuário válido.',
			);
		}

		try {
			questionaries = await this.questionariesRepository.find({
				where: {
					companies: {
						_eq: employee.companyId,
					},
				},
				relations: {
					groupings: true,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the questions in the find-action-plan-for-company service.',
				},
			);
		}

		try {
			questions = await this.questionsRepository.find({
				where: {
					groupings: {
						_eq: In(
							questionaries
								.map((questionary) =>
									questionary.groupings.map(
										(grouping) => grouping._eq,
									),
								)
								.flat(),
						),
					},
				},
				relations: {
					groupings: {
						questionaries: true,
					},
					accordingButtons: {
						accordingButtonFiles: true,
					},
					partialAccordingButtons: true,
					answer: true,
				},
				order: {
					question: 'ASC',
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the questions in the find-action-plan-for-company service.',
				},
			);
		}

		return questions;
	}
}
