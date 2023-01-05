import { Response } from 'express';
import { CreateCompanyDTO } from './dtos/create-company.dto';
import { CreateCompanyService } from './services/create-company.service';
import { FindCompaniesService } from './services/find-companies.service';
export declare class CompaniesController {
    private readonly createCompanyService;
    private readonly findCompaniesService;
    constructor(createCompanyService: CreateCompanyService, findCompaniesService: FindCompaniesService);
    create(createCompanyDTO: CreateCompanyDTO, res: Response): Promise<void>;
    read(query: string, res: Response): Promise<void>;
}
