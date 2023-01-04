import { Repository } from 'typeorm';
import { CompaniesEntity } from './companies.entity';
export declare class CompaniesService {
    private companiesRepository;
    constructor(companiesRepository: Repository<CompaniesEntity>);
    getHello(): string;
    findOneById(_eq: string): Promise<CompaniesEntity | undefined>;
}
