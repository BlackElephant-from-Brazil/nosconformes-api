import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/modules/employees/employee.entity';
import { Repository } from 'typeorm';
import { Grouping } from '../grouping.entity';

@Injectable()
export class FindGroupingByIdForCompanyService {
	constructor(
		@InjectRepository(Grouping)
		private groupingsRepository: Repository<Grouping>,
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
	) {}

	async execute(groupingId: string, employeeId: string): Promise<Grouping> {
		let foundEmployee: Employee;
		let foundGrouping: Grouping;

		try {
			foundEmployee = await this.employeesRepository.findOne({
				where: { _eq: employeeId },
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente mais tarde ou contate o suporte.',
				{
					description: 'Erro ao buscar employee no banco de dados.',
				},
			);
		}

		if (!foundEmployee) {
			throw new BadRequestException(
				'Esteja logado com um usuário válido para esta operação.',
			);
		}

		try {
			foundGrouping = await this.groupingsRepository.findOne({
				where: {
					_eq: groupingId,
				},
				relations: {
					questions: {
						tags: true,
						references: true,
						answer: true,
					},
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente mais tarde ou contate o suporte.',
				{
					description:
						'Erro ao buscar agrupamento no banco de dados.',
				},
			);
		}

		console.log(foundGrouping);

		return foundGrouping;
	}
}
