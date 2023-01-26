import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/modules/users/users.entity';
import { Repository } from 'typeorm';
import { Company } from '../../companies.entity';
import { UpdateAuditorsFromCompanyService } from '../update-auditors-from-company.service';

describe('UpdateAuditorsFromCompanyService', () => {
	let updateAuditorsFromCompanyService: UpdateAuditorsFromCompanyService;
	let companiesRepository: Repository<Company>;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				UpdateAuditorsFromCompanyService,
				{
					provide: getRepositoryToken(Company),
					useClass: Repository,
				},
			],
		}).compile();

		updateAuditorsFromCompanyService =
			module.get<UpdateAuditorsFromCompanyService>(
				UpdateAuditorsFromCompanyService,
			);
		companiesRepository = module.get<Repository<Company>>(
			getRepositoryToken(Company),
		);
	});

	describe('execute', () => {
		let companyId: string;
		let auditors: User[];

		beforeEach(() => {
			companyId = 'companyId';
			auditors = [{ _eq: 'userId' } as User];
		});

		it('should update the auditors of the company', async () => {
			const company = { _eq: companyId, auditors: [] } as Company;
			jest.spyOn(companiesRepository, 'findOne').mockResolvedValue(
				company,
			);
			jest.spyOn(companiesRepository, 'save').mockResolvedValue({
				...company,
				auditors,
			});

			const result = await updateAuditorsFromCompanyService.execute(
				companyId,
				auditors,
			);

			expect(result).toEqual({ ...company, auditors });
			expect(companiesRepository.findOne).toHaveBeenCalledWith({
				where: { _eq: companyId },
				relations: ['auditors'],
			});
			expect(companiesRepository.save).toHaveBeenCalledWith({
				...company,
				auditors,
			});
		});

		it('should throw an InternalServerErrorException if there is an error fetching the company', async () => {
			jest.spyOn(companiesRepository, 'findOne').mockRejectedValue(
				new Error(),
			);

			try {
				await updateAuditorsFromCompanyService.execute(
					companyId,
					auditors,
				);
				fail();
			} catch (error) {
				expect(error).toBeInstanceOf(InternalServerErrorException);
				expect(error.message).toBe(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				);
				expect(error.options.description).toBe(
					'Error fetching company from database',
				);
			}
		});

		it('should throw an InternalServerErrorException if there is an error saving the company', async () => {
			const company = { _eq: companyId, auditors: [] } as Company;
			jest.spyOn(companiesRepository, 'findOne').mockResolvedValue(
				company,
			);
			jest.spyOn(companiesRepository, 'save').mockRejectedValue(
				new Error(),
			);

			try {
				await updateAuditorsFromCompanyService.execute(
					companyId,
					auditors,
				);
				fail();
			} catch (error) {
				expect(error).toBeInstanceOf(InternalServerErrorException);
				expect(error.message).toBe(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				);
				expect(error.options.description).toBe(
					'Error saving company in database',
				);
			}
		});
	});
});

afterEach(() => {
	jest.clearAllMocks();
});
