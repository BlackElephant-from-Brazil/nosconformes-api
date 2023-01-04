import { CompaniesEntity } from './companies.entity';
import { CompaniesService } from './company.service';
export declare class CompaniesController {
    private readonly companyService;
    constructor(companyService: CompaniesService);
    getHello(): string;
    show(): Promise<CompaniesEntity | undefined>;
}
