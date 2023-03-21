import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/modules/employees/employee.entity';
import { Repository } from 'typeorm';
import { Company } from '../companies.entity';

@Injectable()
export class FindCompanyByIdService {
	constructor(
		@InjectRepository(Company)
		private companiesRepository: Repository<Company>,
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
	) {}

	async execute(companyId: string): Promise<Company> {
		let foundCompany: Company & {
			manager?: Employee;
		};
		let manager: Employee;

		try {
			foundCompany = await this.companiesRepository.findOne({
				where: {
					_eq: companyId,
				},
			});
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error while trying to get company by id',
				},
			);
		}

		if (!foundCompany) {
			throw new BadRequestException(
				'Não foi possível encontrar a empresa com o id informado.',
			);
		}

		try {
			manager = await this.employeesRepository.findOne({
				where: {
					companyId: companyId,
					accessLevel: 'manager',
				},
			});
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error while trying to get manager by id',
				},
			);
		}

		if (manager) foundCompany.manager = manager;

		return foundCompany;
	}
}
