import { COMPANIES_REPOSITORY, DATA_SOURCE } from 'src/config/constants';
import { DataSource } from 'typeorm';
import { CompaniesEntity } from './companies.entity';

export const companyProviders = [
  {
    provide: COMPANIES_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CompaniesEntity),
    inject: [DATA_SOURCE],
  },
];
