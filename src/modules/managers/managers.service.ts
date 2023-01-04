import { Injectable } from '@nestjs/common';
import { CompaniesEntity } from '../companies/companies.entity';

@Injectable()
export class ManagersService {
  getHello(): string {
    return 'Hello World!';
  }

  async findAll({ companyId: string }): Promise<CompaniesEntity[]> {
    const company: CompaniesEntity = {
      _eq: 'companyId',
      cnpj: 'asaoks',
      logo: 'asaoks',
      name: 'asaoks',
      site: 'asaoks',
      // __typename: '',
      // manager: [],
    };

    return [company];
  }
}
