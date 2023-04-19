import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccordingButtonFile } from 'src/modules/according-button-files/according-button-file.entity';
import { Employee } from 'src/modules/employees/employee.entity';
import { Question } from 'src/modules/questions/question.entity';
import { Repository } from 'typeorm';
import { Answer } from '../answer.entity';

@Injectable()
export class RegisterAnswerAccordingButtonService {
	constructor(
		@InjectRepository(Question)
		private questionsRepository: Repository<Question>,
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
		@InjectRepository(AccordingButtonFile)
		private accordingButtonFilesRepository: Repository<AccordingButtonFile>,
		@InjectRepository(Answer)
		private answersRespository: Repository<Answer>,
	) {}

	async execute(
		questionId: string,
		buttonId: string,
		employeeId: string,
		filePath: string,
	): Promise<void> {
		let question: Question;
		let employee: Employee;
		let accordingButtonFile: AccordingButtonFile;

		try {
			employee = await this.employeesRepository.findOne({
				where: {
					_eq: employeeId,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Tente novamente mais tarde ou contate o suporte.',
				{
					description:
						'Erro ao buscar funcionário no banco de dados.',
				},
			);
		}

		if (!employee) {
			throw new BadRequestException(
				'Você precisa estar logado com um funcionário válido para esta operação.',
			);
		}

		try {
			question = await this.questionsRepository.findOne({
				where: {
					_eq: questionId,
				},
				relations: {
					answer: true,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Tente novamente mais tarde ou contate o suporte.',
				{
					description: 'Erro ao buscar questão no banco de dados.',
				},
			);
		}

		if (!question) {
			throw new BadRequestException(
				'Esta questão não existe ou foi excluída.',
			);
		}

		try {
			accordingButtonFile = this.accordingButtonFilesRepository.create({
				accordingButtonId: buttonId,
				filePath,
			});
			await this.accordingButtonFilesRepository.save(accordingButtonFile);
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Tente novamente mais tarde ou contate o suporte.',
				{
					description:
						'Erro ao salvar arquivo de resposta no banco de dados.',
				},
			);
		}

		if (!question.answer) {
			question.answer = this.answersRespository.create();
		}
		question.answer.conformity = 'conform';
		question.answer.companyId = employee.companyId;
		question.answer.questionId = questionId;
		question.answer.status = 'pending';

		try {
			await this.questionsRepository.save(question);
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Tente novamente mais tarde ou contate o suporte.',
				{
					description:
						'Erro ao salvar resposta de acordo no banco de dados.',
				},
			);
		}
	}
}
