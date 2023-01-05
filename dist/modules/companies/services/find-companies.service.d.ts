import { Repository } from 'typeorm';
import { Company } from '../companies.entity';
export declare class FindCompaniesService {
    private companiesRepository;
    constructor(companiesRepository: Repository<Company>);
    execute(query?: string): Promise<Company[]>;
}
