import { Repository } from 'typeorm';
import { Company } from '../companies.entity';
import { CreateCompanyDTO } from '../dtos/create-company.dto';
export declare class CreateCompanyService {
    private companiesRepository;
    constructor(companiesRepository: Repository<Company>);
    execute({ logo, name, site, cnpj, }: CreateCompanyDTO): Promise<Company>;
}
