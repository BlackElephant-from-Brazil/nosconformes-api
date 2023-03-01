import { Test, TestingModule } from '@nestjs/testing';
import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Employee } from 'src/modules/employees/employee.entity';
import { User } from 'src/modules/users/users.entity';
import { FindCompanyByIdService } from '../find-company-by-id.service';
import { Company } from '../../companies.entity';
import { GetCompanyRespDTO } from '../../dtos/resp/get-company.resp.dto';

describe('GetCompanyService', () => {
	let service: FindCompanyByIdService;
	let companiesRepositoryMock: jest.Mocked<Repository<Company>>;
	let employeesRepositoryMock: jest.Mocked<Repository<Employee>>;
	let usersRepositoryMock: jest.Mocked<Repository<User>>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FindCompanyByIdService,
				{
					provide: 'CompanyRepository',
					useValue: {
						findOne: jest.fn(),
					},
				},
				{
					provide: 'EmployeeRepository',
					useValue: {
						findOne: jest.fn(),
					},
				},
				{
					provide: 'UserRepository',
					useValue: {
						find: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<FindCompanyByIdService>(FindCompanyByIdService);
		companiesRepositoryMock = module.get('CompanyRepository');
		employeesRepositoryMock = module.get('EmployeeRepository');
		usersRepositoryMock = module.get('UserRepository');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('execute', () => {
		const companyId = '1';

		it('should return the company with manager and available auditors', async () => {
			const company: Company = {
				_eq: companyId,
				name: 'Company A',
				auditors: [],
			} as Company;

			const manager: Employee = {
				_eq: '1',
				name: 'Manager A',
				accessLevel: 'manager',
				companyId: companyId,
			} as Employee;

			const auditors: User[] = [
				{
					_eq: '1',
					name: 'Auditor A',
					accessLevel: 'auditor',
				} as User,
				{
					_eq: '2',
					name: 'Auditor B',
					accessLevel: 'auditor',
				} as User,
			];

			const expectedResponse: GetCompanyRespDTO = {
				company: {
					...company,
					manager: { ...manager },
				},
				availableAuditors: [...auditors],
			};

			companiesRepositoryMock.findOne.mockResolvedValueOnce({
				...company,
				auditors: [...auditors],
			});
			employeesRepositoryMock.findOne.mockResolvedValueOnce({
				...manager,
			});
			usersRepositoryMock.find.mockResolvedValueOnce([...auditors]);

			const result = await service.execute(companyId);

			expect(result).toEqual(expectedResponse);
			expect(companiesRepositoryMock.findOne).toHaveBeenCalledWith({
				where: { _eq: companyId },
				relations: { auditors: true },
			});
			expect(employeesRepositoryMock.findOne).toHaveBeenCalledWith({
				where: { companyId: companyId, accessLevel: 'manager' },
			});
			expect(usersRepositoryMock.find).toHaveBeenCalledWith({
				where: [
					{
						accessLevel: 'auditor',
						_eq: expect.not.arrayContaining(
							auditors.map((a) => a._eq),
						),
					},
					{
						accessLevel: 'master',
						_eq: expect.not.arrayContaining(
							auditors.map((a) => a._eq),
						),
					},
				],
			});
		});

		it('should throw BadRequestException if company not found', async () => {
			companiesRepositoryMock.findOne.mockResolvedValueOnce(undefined);
			await expect(service.execute(companyId)).rejects.toThrow(
				BadRequestException,
			);
			expect(companiesRepositoryMock.findOne).toHaveBeenCalledWith({
				where: { _eq: companyId },
				relations: { auditors: true },
			});
		});

		it('should throw InternalServerErrorException if findOne in company repository throws an exception', async () => {
			companiesRepositoryMock.findOne.mockRejectedValueOnce(new Error());

			await expect(service.execute(companyId)).rejects.toThrow(
				InternalServerErrorException,
			);
			expect(companiesRepositoryMock.findOne).toHaveBeenCalledWith({
				where: { _eq: companyId },
				relations: { auditors: true },
			});
		});

		it('should throw InternalServerErrorException if findOne in employee repository throws an exception', async () => {
			companiesRepositoryMock.findOne.mockResolvedValueOnce(
				{} as Company,
			);
			employeesRepositoryMock.findOne.mockRejectedValueOnce(new Error());

			await expect(service.execute(companyId)).rejects.toThrow(
				InternalServerErrorException,
			);
			expect(companiesRepositoryMock.findOne).toHaveBeenCalledWith({
				where: { _eq: companyId },
				relations: { auditors: true },
			});
			expect(employeesRepositoryMock.findOne).toHaveBeenCalledWith({
				where: { companyId: companyId, accessLevel: 'manager' },
			});
		});

		it('should throw InternalServerErrorException if find in user repository throws an exception', async () => {
			companiesRepositoryMock.findOne.mockResolvedValueOnce(
				{} as Company,
			);
			employeesRepositoryMock.findOne.mockResolvedValueOnce(
				{} as Employee,
			);
			usersRepositoryMock.find.mockRejectedValueOnce(new Error());

			await expect(service.execute(companyId)).rejects.toThrow(
				InternalServerErrorException,
			);
			expect(companiesRepositoryMock.findOne).toHaveBeenCalledWith({
				where: { _eq: companyId },
				relations: { auditors: true },
			});
			expect(employeesRepositoryMock.findOne).toHaveBeenCalledWith({
				where: { companyId: companyId, accessLevel: 'manager' },
			});
			expect(usersRepositoryMock.find).toHaveBeenCalledWith({
				where: [
					{
						accessLevel: 'auditor',
						_eq: expect.not.arrayContaining([]),
					},
					{
						accessLevel: 'master',
						_eq: expect.not.arrayContaining([]),
					},
				],
			});
		});
	});
});
