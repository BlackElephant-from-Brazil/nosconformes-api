import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/modules/employees/employee.entity';
import { User } from 'src/modules/users/users.entity';
import { Repository } from 'typeorm';
import { Company } from '../companies.entity';
import { GetCompanyRespDTO } from '../dtos/resp/get-company.resp.dto';

@Injectable()
export class GetCompanyService {
	constructor(
		@InjectRepository(Company)
		private companiesRepository: Repository<Company>,
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async execute(companyId: string): Promise<GetCompanyRespDTO> {
		let foundCompany: Company & {
			manager?: Employee;
		};
		let auditors: User[];

		try {
			foundCompany = await this.companiesRepository.findOne({
				where: {
					_eq: companyId,
				},
			});

			const manager = await this.employeesRepository.findOne({
				where: {
					companyId: companyId,
					accessLevel: 'manager',
				},
			});

			auditors = await this.usersRepository.find({
				where: [
					{
						accessLevel: 'auditor',
					},
					{
						accessLevel: 'master',
					},
				],
			});

			foundCompany.manager = manager;
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error while trying to get company by id',
				},
			);
		}

		return { company: foundCompany, availableAuditors: auditors };
	}
}
