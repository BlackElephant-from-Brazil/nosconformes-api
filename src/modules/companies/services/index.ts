import { CreateCompanyService } from './create-company.service';
import { FindAllCompaniesService } from './find-all-companies.service';
import { FindCompanyByIdService } from './find-company-by-id.service';
import { UpdateAuditorsFromCompanyService } from './update-auditors-from-company.service';
import { UpdateCompanyDataService } from './update-company-data.service';
import { UpdateManagerDataService } from './update-manager-data.service';

export const companiesServices = [
	CreateCompanyService,
	FindAllCompaniesService,
	FindCompanyByIdService,
	UpdateAuditorsFromCompanyService,
	UpdateCompanyDataService,
	UpdateManagerDataService,
];
