import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Employee } from 'src/modules/employees/employee.entity';
import { Company } from '../../companies.entity';
import { CreateCompanyService } from '../create-company.service';

describe('CreateCompanyService', () => {
	let createCompanyService: CreateCompanyService;
	let companiesRepository: Repository<Company>;
	let employeesRepository: Repository<Employee>;

	beforeEach(async () => {
		const testingModule: TestingModule = await Test.createTestingModule({
			providers: [
				CreateCompanyService,
				{
					provide: getRepositoryToken(Company),
					useValue: {
						findOneBy: jest.fn(),
						create: jest.fn(),
						save: jest.fn(),
					},
				},
				{
					provide: getRepositoryToken(Employee),
					useValue: { create: jest.fn(), save: jest.fn() },
				},
			],
		}).compile();

		createCompanyService =
			testingModule.get<CreateCompanyService>(CreateCompanyService);
		companiesRepository = testingModule.get<Repository<Company>>(
			getRepositoryToken(Company),
		);
		employeesRepository = testingModule.get<Repository<Employee>>(
			getRepositoryToken(Employee),
		);
	});

	it('should create a new company', async () => {
		const company = {
			cnpj: '12345678901234',
			name: 'My Company',
			logo: 'https://mycompany.com.br/logo.png',
			site: 'https://mycompany.com.br/',
		};
		const manager = {
			name: 'John Doe',
			email: 'johndoe@mycompany.com',
			phone: '19995545043',
			office: 'IT Manager',
			department: 'IT',
		};

		(companiesRepository.findOneBy as jest.Mock).mockResolvedValue(null);
		(companiesRepository.create as jest.Mock).mockReturnValue({
			...company,
			_eq: 1,
		});
		(companiesRepository.save as jest.Mock).mockResolvedValue({
			...company,
			_eq: 1,
		});
		(employeesRepository.create as jest.Mock).mockReturnValue({
			...manager,
			accessLevel: 'manager',
			companyId: 1,
		});
		(employeesRepository.save as jest.Mock).mockResolvedValue({
			...manager,
			accessLevel: 'manager',
			companyId: 1,
		});

		const result = await createCompanyService.execute({ company, manager });
		expect(result).toEqual({ ...company, _eq: 1 });
		expect(companiesRepository.findOneBy).toHaveBeenCalledWith({
			cnpj: company.cnpj,
		});
		expect(companiesRepository.create).toHaveBeenCalledWith({
			logo: company.logo,
			name: company.name,
			site: company.site,
			cnpj: company.cnpj,
		});
		expect(companiesRepository.save).toHaveBeenCalledWith({
			...company,
			_eq: 1,
		});
		expect(employeesRepository.create).toHaveBeenCalledWith({
			...manager,
			accessLevel: 'manager',
			companyId: 1,
		});
		expect(employeesRepository.save).toHaveBeenCalledWith({
			...manager,
			accessLevel: 'manager',
			companyId: 1,
		});
	});

	it('should throw a bad request exception when trying to create a company with an already registered cnpj', async () => {
		const company = {
			cnpj: '12345678901234',
			name: 'My Company',
			logo: 'https://mycompany.com.br/logo.png',
			site: 'https://mycompany.com.br/',
		};
		const manager = {
			name: 'John Doe',
			email: 'johndoe@mycompany.com',
			phone: '19995545043',
			office: 'IT Manager',
			department: 'IT',
		};
		(companiesRepository.findOneBy as jest.Mock).mockResolvedValue({
			...company,
			name: 'Another Company',
		});
		try {
			await createCompanyService.execute({ company, manager });
		} catch (e) {
			expect(e).toBeInstanceOf(BadRequestException);
			expect(e.message).toEqual(
				'O cnpj já está cadastrado na plataforma para a empresa Another Company',
			);
		}
		expect(companiesRepository.findOneBy).toHaveBeenCalledWith({
			cnpj: company.cnpj,
		});
		expect(companiesRepository.create).not.toHaveBeenCalled();
		expect(companiesRepository.save).not.toHaveBeenCalled();
		expect(employeesRepository.create).not.toHaveBeenCalled();
		expect(employeesRepository.save).not.toHaveBeenCalled();
	});

	it('should throw an internal server error exception when an error occurs while trying to find a company with the same cnpj', async () => {
		const company = {
			cnpj: '12345678901234',
			name: 'My Company',
			logo: 'https://mycompany.com.br/logo.png',
			site: 'https://mycompany.com.br/',
		};
		const manager = {
			name: 'John Doe',
			email: 'johndoe@mycompany.com',
			phone: '19995545043',
			office: 'IT Manager',
			department: 'IT',
		};
		(companiesRepository.findOneBy as jest.Mock).mockRejectedValue(
			new Error('Error'),
		);
		try {
			await createCompanyService.execute({ company, manager });
		} catch (e) {
			expect(e).toBeInstanceOf(InternalServerErrorException);
			expect(e.message).toEqual(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
			);
			expect(e.options).toEqual({
				description:
					'The error occurred when trying to find some company with existant CNPJ',
			});
		}
		expect(companiesRepository.findOneBy).toHaveBeenCalledWith({
			cnpj: company.cnpj,
		});
		expect(companiesRepository.create).not.toHaveBeenCalled();
		expect(companiesRepository.save).not.toHaveBeenCalled();
		expect(employeesRepository.create).not.toHaveBeenCalled();
		expect(employeesRepository.save).not.toHaveBeenCalled();
	});

	it('should throw an internal server error exception when an error occurs while trying to save the company', async () => {
		const company = {
			cnpj: '12345678901234',
			name: 'My Company',
			logo: 'https://mycompany.com.br/logo.png',
			site: 'https://mycompany.com.br/',
		};
		const manager = {
			name: 'John Doe',
			email: 'johndoe@mycompany.com',
			phone: '19995545043',
			office: 'IT Manager',
			department: 'IT',
		};
		(companiesRepository.findOneBy as jest.Mock).mockResolvedValue(null);
		(companiesRepository.create as jest.Mock).mockReturnValue({
			...company,
			_eq: 1,
		});
		(companiesRepository.save as jest.Mock).mockRejectedValue(
			new Error('Error'),
		);
		try {
			await createCompanyService.execute({ company, manager });
		} catch (e) {
			expect(e).toBeInstanceOf(InternalServerErrorException);
			expect(e.message).toEqual(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
			);
			expect(e.options).toEqual({
				description:
					'The error occurred when trying to save the company',
			});
		}
		expect(companiesRepository.findOneBy).toHaveBeenCalledWith({
			cnpj: company.cnpj,
		});
		expect(companiesRepository.create).toHaveBeenCalledWith({
			logo: company.logo,
			name: company.name,
			site: company.site,
			cnpj: company.cnpj,
		});
		expect(companiesRepository.save).toHaveBeenCalledWith({
			...company,
			_eq: 1,
		});
		expect(employeesRepository.create).not.toHaveBeenCalled();
		expect(employeesRepository.save).not.toHaveBeenCalled();
	});

	it('should throw an internal server error exception when an error occurs while trying to save the manager', async () => {
		const company = {
			cnpj: '12345678901234',
			name: 'My Company',
			logo: 'https://mycompany.com.br/logo.png',
			site: 'https://mycompany.com.br/',
		};
		const manager = {
			name: 'John Doe',
			email: 'johndoe@mycompany.com',
			phone: '19995545043',
			office: 'IT Manager',
			department: 'IT',
		};
		(companiesRepository.findOneBy as jest.Mock).mockResolvedValue(null);
		(companiesRepository.create as jest.Mock).mockReturnValue({
			...company,
			_eq: 1,
		});
		(companiesRepository.save as jest.Mock).mockResolvedValue({
			...company,
			_eq: 1,
		});
		(employeesRepository.create as jest.Mock).mockReturnValue({
			...manager,
			accessLevel: 'manager',
			companyId: 1,
		});
		(employeesRepository.save as jest.Mock).mockRejectedValue(
			new Error('Error'),
		);
		try {
			await createCompanyService.execute({ company, manager });
		} catch (e) {
			expect(e).toBeInstanceOf(InternalServerErrorException);
			expect(e.message).toEqual(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
			);
			expect(e.options).toEqual({
				description:
					'The error occurred when trying to save the manager',
			});
		}
		expect(companiesRepository.findOneBy).toHaveBeenCalledWith({
			cnpj: company.cnpj,
		});
		expect(companiesRepository.create).toHaveBeenCalledWith({
			logo: company.logo,
			name: company.name,
			site: company.site,
			cnpj: company.cnpj,
		});
		expect(companiesRepository.save).toHaveBeenCalledWith({
			...company,
			_eq: 1,
		});
		expect(employeesRepository.create).toHaveBeenCalledWith({
			...manager,
			accessLevel: 'manager',
			companyId: 1,
		});
		expect(employeesRepository.save).toHaveBeenCalledWith({
			...manager,
			accessLevel: 'manager',
			companyId: 1,
		});
	});

	it('should not create manager when manager object is empty', async () => {
		const company = {
			cnpj: '12345678901234',
			name: 'My Company',
			logo: 'https://mycompany.com.br/logo.png',
			site: 'https://mycompany.com.br/',
		};
		const manager = {};
		(companiesRepository.findOneBy as jest.Mock).mockResolvedValue(null);
		(companiesRepository.create as jest.Mock).mockReturnValue({
			...company,
			_eq: 1,
		});
		(companiesRepository.save as jest.Mock).mockResolvedValue({
			...company,
			_eq: 1,
		});
		(employeesRepository.create as jest.Mock).mockReturnValue({
			...manager,
			accessLevel: 'manager',
			companyId: 1,
		});
		(employeesRepository.save as jest.Mock).mockResolvedValue({
			...manager,
			accessLevel: 'manager',
			companyId: 1,
		});

		const result = await createCompanyService.execute({ company, manager });
		expect(result).toEqual({ ...company, _eq: 1 });
		expect(companiesRepository.findOneBy).toHaveBeenCalledWith({
			cnpj: company.cnpj,
		});
		expect(companiesRepository.create).toHaveBeenCalledWith({
			logo: company.logo,
			name: company.name,
			site: company.site,
			cnpj: company.cnpj,
		});
		expect(companiesRepository.save).toHaveBeenCalledWith({
			...company,
			_eq: 1,
		});
		expect(employeesRepository.create).not.toHaveBeenCalled();
		expect(employeesRepository.save).not.toHaveBeenCalled();
	});
});
