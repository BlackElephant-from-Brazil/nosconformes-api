import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/modules/employees/employee.entity';
import { Repository } from 'typeorm';
import { Company } from '../companies.entity';
import { CreateCompanyDTO } from '../dtos/create-company.dto';
import { BCryptProvider } from 'src/providers/encriptation/bcrypt.provider';

@Injectable()
export class CreateCompanyService {
	constructor(
		@InjectRepository(Company)
		private companiesRepository: Repository<Company>,
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
		private hashProvider: BCryptProvider,
	) {}

	async execute({ company, manager }: CreateCompanyDTO): Promise<Company> {
		let createdCompany: Company;
		let foundCompany: Company;
		try {
			foundCompany = await this.companiesRepository.findOneBy({
				cnpj: company.cnpj,
			});
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'The error occurred when trying to find some company with existant CNPJ',
				},
			);
		}

		if (foundCompany) {
			throw new BadRequestException(
				`O cnpj já está cadastrado na plataforma para a empresa ${foundCompany.name}`,
			);
		}

		try {
			createdCompany = this.companiesRepository.create({
				logo: company.logo || '',
				name: company.name,
				sector: company.sector,
				site: company.site,
				cnpj: company.cnpj,
			});
			await this.companiesRepository.save(createdCompany);
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'The error occurred when trying to save the company',
				},
			);
		}

		if (manager) {
			let foundManager: Employee;

			try {
				foundManager = await this.employeesRepository.findOne({
					where: {
						email: manager.email,
					},
					relations: {
						company: true,
					},
				});
			} catch (e) {
				throw new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description:
							'The error occurred when trying to find some manager with existant email',
					},
				);
			}

			if (foundManager) {
				throw new BadRequestException(
					`O email já está cadastrado na plataforma para a empresa ${foundManager.company.name}`,
				);
			}

			let hashedPassword: string;

			try {
				hashedPassword = await this.hashProvider.hash({
					password: '123456',
				});
			} catch (e) {
				throw new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description:
							'The error occurred when trying to hash the password',
					},
				);
			}

			try {
				const createdManager = this.employeesRepository.create({
					...manager,
					profilePicture: '',
					accessLevel: 'patrocinador',
					companyId: createdCompany._eq,
					password: hashedPassword,
				});
				await this.employeesRepository.save(createdManager);
			} catch (e) {
				console.log(e);
				throw new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description:
							'The error occurred when trying to save the manager',
					},
				);
			}
		}

		console.log(createdCompany);

		return createdCompany;
	}
}
