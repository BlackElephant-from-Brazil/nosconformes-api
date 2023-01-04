import { Inject, Injectable } from '@nestjs/common';
import { COMPANIES_REPOSITORY } from 'src/config/constants';
import { Repository } from 'typeorm';
import { CompaniesEntity } from './companies.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject(COMPANIES_REPOSITORY)
    private companiesRepository: Repository<CompaniesEntity>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async findOneById(_eq: string): Promise<CompaniesEntity | undefined> {
    const company = await this.companiesRepository.findOne({ where: { _eq } });

    return company;
  }
}
