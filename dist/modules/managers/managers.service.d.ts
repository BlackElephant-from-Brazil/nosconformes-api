import { CompaniesEntity } from '../companies/companies.entity';
export declare class ManagersService {
    getHello(): string;
    findAll({ companyId: string }: {
        companyId: any;
    }): Promise<CompaniesEntity[]>;
}
