import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/modules/users/users.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { GetCompanyService } from '../get-company.service';
import { Company } from '../../companies.entity';
import { Employee } from 'src/modules/employees/employee.entity';

describe('GetCompanyService', () => {
	let getCompanyService: GetCompanyService;
	let companiesRepository: Repository<Company>;
	let employeesRepository: Repository<Employee>;
	let usersRepository: Repository<User>;

	beforeEach(async () => {
		const testingModule: TestingModule = await Test.createTestingModule({
			providers: [
				GetCompanyService,
				{
					provide: getRepositoryToken(Company),
					useValue: {
						findOne: jest.fn().mockResolvedValue({
							id: '1',
							name: 'Test Company',
						}),
					},
				},
				{
					provide: getRepositoryToken(Employee),
					useValue: {
						findOne: jest.fn().mockResolvedValue({
							id: '1',
							name: 'Test Manager',
						}),
					},
				},
				{
					provide: getRepositoryToken(User),
					useValue: {
						find: jest.fn().mockResolvedValue([
							{ id: '1', name: 'Test Auditor 1' },
							{ id: '2', name: 'Test Auditor 2' },
						]),
					},
				},
			],
		}).compile();

		getCompanyService =
			testingModule.get<GetCompanyService>(GetCompanyService);
		companiesRepository = testingModule.get<Repository<Company>>(
			getRepositoryToken(Company),
		);
		employeesRepository = testingModule.get<Repository<Employee>>(
			getRepositoryToken(Employee),
		);
		usersRepository = testingModule.get<Repository<User>>(
			getRepositoryToken(User),
		);
	});

	it('should be defined', () => {
		expect(getCompanyService).toBeDefined();
	});

	it('should return company and available auditors', async () => {
		const result = await getCompanyService.execute('1');
		expect(companiesRepository.findOne).toBeCalledWith({
			where: { _eq: '1' },
		});
		expect(employeesRepository.findOne).toBeCalledWith({
			where: { companyId: '1', accessLevel: 'manager' },
		});
		expect(usersRepository.find).toBeCalledWith({
			where: [{ accessLevel: 'auditor' }, { accessLevel: 'master' }],
		});
		expect(result).toEqual({
			company: {
				id: '1',
				name: 'Test Company',
				manager: { id: '1', name: 'Test Manager' },
			},
			availableAuditors: [
				{ id: '1', name: 'Test Auditor 1' },
				{ id: '2', name: 'Test Auditor 2' },
			],
		});
	});

	it('should throw an InternalServerErrorException when an error occurs', async () => {
		jest.spyOn(companiesRepository, 'findOne').mockRejectedValue(
			new Error(),
		);
		try {
			await getCompanyService.execute('1');
		} catch (e) {
			expect(e).toBeInstanceOf(InternalServerErrorException);
			expect(e.message).toBe(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
			);
			expect(e.options).toEqual({
				description: 'Error while trying to get company by id',
			});
		}
	});
});
