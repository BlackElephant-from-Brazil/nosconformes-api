import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/modules/employees/employee.entity';
import { Repository } from 'typeorm';
import { Company } from '../companies.entity';

type UpdateManagerData = {
	name: string;
	email: string;
	phone: string;
	office: string;
	department: string;
};

@Injectable()
export class UpdateManagerDataService {
	constructor(
		@InjectRepository(Company)
		private companiesRepository: Repository<Company>,
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
	) {}

	async execute(
		companyId: string,
		managerData: UpdateManagerData,
	): Promise<Employee> {
		let foundCompany: Company;
		let foundManager: Employee;

		try {
			foundCompany = await this.companiesRepository.findOne({
				where: {
					_eq: companyId,
				},
			});
		} catch (err) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the company in the update-manager-data.service.ts',
				},
			);
		}

		if (!foundCompany)
			throw new BadRequestException('A empresa informada é inválida.', {
				description:
					'This error occurred trying to update the company data. Invalid companyId',
			});

		try {
			foundManager = await this.employeesRepository.findOne({
				where: {
					companyId,
					accessLevel: 'patrocinador',
				},
			});
		} catch (err) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the manager in the update-manager-data.service.ts',
				},
			);
		}

		// TODO: IF FOUND BY EMAIL, CHECK IF THE EMAIL IS THE SAME AS THE FOUND MANAGER

		if (!foundManager) {
			try {
				const createdManager = this.employeesRepository.create({
					accessLevel: 'patrocinador',
					companyId,
					department: managerData.department,
					email: managerData.email,
					name: managerData.name,
					phone: managerData.phone,
					office: managerData.office,
				});

				await this.employeesRepository.save(createdManager);

				foundManager = createdManager;
			} catch (err) {
				console.log(err);
				throw new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description:
							'This error occurred when trying to create the manager in the update-manager-data.service.ts',
					},
				);
			}
		} else {
			foundManager.department = managerData.department;
			foundManager.email = managerData.email;
			foundManager.name = managerData.name;
			foundManager.phone = managerData.phone;
			foundManager.office = managerData.office;

			try {
				await this.employeesRepository.save(foundManager);
			} catch (err) {
				throw new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description:
							'This error occurred when trying to save the manager data in the update-manager-data.service.ts',
					},
				);
			}
		}

		return foundManager;
	}
}
