import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Employee } from 'src/modules/employees/employee.entity';
import { Repository } from 'typeorm';
import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { UpdateManagerDataService } from '../update-manager-data.service';
import { Company } from '../../companies.entity';

describe('UpdateManagerDataService', () => {
	let updateManagerDataService: UpdateManagerDataService;
	let companyRepository: Repository<Company>;
	let employeeRepository: Repository<Employee>;

	beforeEach(async () => {
		const testingModule: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateManagerDataService,
				{
					provide: getRepositoryToken(Company),
					useValue: {
						findOne: jest.fn(),
						save: jest.fn(),
						create: jest.fn(),
					},
				},
				{
					provide: getRepositoryToken(Employee),
					useValue: {
						findOne: jest.fn(),
						save: jest.fn(),
						create: jest.fn(),
					},
				},
			],
		}).compile();

		updateManagerDataService = testingModule.get<UpdateManagerDataService>(
			UpdateManagerDataService,
		);
		companyRepository = testingModule.get<Repository<Company>>(
			getRepositoryToken(Company),
		);
		employeeRepository = testingModule.get<Repository<Employee>>(
			getRepositoryToken(Employee),
		);
	});

	it('should be defined', () => {
		expect(updateManagerDataService).toBeDefined();
	});

	describe('execute', () => {
		it('should update manager data', async () => {
			const companyId = 'companyId';
			const managerData = {
				name: 'managerName',
				email: 'managerEmail',
				phone: 'managerPhone',
				office: 'managerOffice',
				department: 'managerDepartment',
			};

			const foundCompany = new Company();
			(companyRepository.findOne as jest.Mock).mockResolvedValue(
				foundCompany,
			);

			const foundManager = new Employee();
			(employeeRepository.findOne as jest.Mock).mockResolvedValue(
				foundManager,
			);

			await updateManagerDataService.execute(companyId, managerData);

			expect(foundManager.name).toBe(managerData.name);
			expect(foundManager.email).toBe(managerData.email);
			expect(foundManager.phone).toBe(managerData.phone);
			expect(foundManager.office).toBe(managerData.office);
			expect(foundManager.department).toBe(managerData.department);
		});

		it('should create manager if not found', async () => {
			const companyId = 'companyId';
			const managerData = {
				name: 'managerName',
				email: 'managerEmail',
				phone: 'managerPhone',
				office: 'managerOffice',
				department: 'managerDepartment',
			};

			const foundCompany = new Company();
			(companyRepository.findOne as jest.Mock).mockResolvedValue(
				foundCompany,
			);
			(employeeRepository.findOne as jest.Mock).mockResolvedValue(null);
			const createdManager = new Employee();
			(employeeRepository.create as jest.Mock).mockReturnValue(
				createdManager,
			);

			await updateManagerDataService.execute(companyId, managerData);

			expect(employeeRepository.save).toHaveBeenCalledWith(
				createdManager,
			);
		});

		it('should throw BadRequestException if company is invalid', async () => {
			const companyId = 'companyId';
			const managerData = {
				name: 'managerName',
				email: 'managerEmail',
				phone: 'managerPhone',
				office: 'managerOffice',
				department: 'managerDepartment',
			};

			(companyRepository.findOne as jest.Mock).mockResolvedValue(null);

			await expect(
				updateManagerDataService.execute(companyId, managerData),
			).rejects.toThrowError(BadRequestException);
		});

		it('should throw InternalServerErrorException if error occurred when finding company', async () => {
			const companyId = 'companyId';
			const managerData = {
				name: 'managerName',
				email: 'managerEmail',
				phone: 'managerPhone',
				office: 'managerOffice',
				department: 'managerDepartment',
			};

			(companyRepository.findOne as jest.Mock).mockRejectedValue(
				new Error(),
			);

			await expect(
				updateManagerDataService.execute(companyId, managerData),
			).rejects.toThrowError(InternalServerErrorException);
		});

		it('should throw InternalServerErrorException if error occurred when finding manager', async () => {
			const companyId = 'companyId';
			const managerData = {
				name: 'managerName',
				email: 'managerEmail',
				phone: 'managerPhone',
				office: 'managerOffice',
				department: 'managerDepartment',
			};

			const foundCompany = new Company();
			(companyRepository.findOne as jest.Mock).mockResolvedValue(
				foundCompany,
			);
			(employeeRepository.findOne as jest.Mock).mockRejectedValue(
				new Error(),
			);

			await expect(
				updateManagerDataService.execute(companyId, managerData),
			).rejects.toThrowError(InternalServerErrorException);
		});

		it('should throw InternalServerErrorException if error occurred when creating manager', async () => {
			const companyId = 'companyId';
			const managerData = {
				name: 'managerName',
				email: 'managerEmail',
				phone: 'managerPhone',
				office: 'managerOffice',
				department: 'managerDepartment',
			};

			const foundCompany = new Company();
			(companyRepository.findOne as jest.Mock).mockResolvedValue(
				foundCompany,
			);
			(employeeRepository.findOne as jest.Mock).mockResolvedValue(null);
			(employeeRepository.create as jest.Mock).mockReturnValue(null);
			(employeeRepository.save as jest.Mock).mockRejectedValue(
				new Error(),
			);

			await expect(
				updateManagerDataService.execute(companyId, managerData),
			).rejects.toThrowError(InternalServerErrorException);
		});
	});
});
