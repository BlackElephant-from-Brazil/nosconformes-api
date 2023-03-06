import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/modules/employees/employee.entity';
import { User } from 'src/modules/users/users.entity';
import { In, Not, Repository } from 'typeorm';
import { Company } from '../companies.entity';
import { GetCompanyRespDTO } from '../dtos/resp/get-company.resp.dto';

@Injectable()
export class FindCompanyByIdService {
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
		let manager: Employee;
		let availableAuditors: User[];

		try {
			foundCompany = await this.companiesRepository.findOne({
				where: {
					_eq: companyId,
				},
				relations: {
					auditors: true,
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

		try {
			const auditorsIds = foundCompany.auditors.map((a) => a._eq);
			availableAuditors = await this.usersRepository.find({
				where: [
					{
						accessLevel: 'auditor',
						_eq: Not(In(auditorsIds)),
					},
					{
						accessLevel: 'master',
						_eq: Not(In(auditorsIds)),
					},
				],
			});
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'Error while trying to get availables auditors to company',
				},
			);
		}

		return { company: foundCompany, availableAuditors };
	}
}
