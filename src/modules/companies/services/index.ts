import { CreateCompanyService } from './create-company.service';
import { FindCompaniesService } from './find-companies.service';
import { GetCompanyService } from './get-company.service';
import { UpdateAuditorsFromCompanyService } from './update-auditors-from-company.service';
import { UpdateCompanyDataService } from './update-company-data.service';
import { UpdateManagerDataService } from './update-manager-data.service';

export const companiesServices = [
	CreateCompanyService,
	FindCompaniesService,
	GetCompanyService,
	UpdateAuditorsFromCompanyService,
	UpdateCompanyDataService,
	UpdateManagerDataService,
];
