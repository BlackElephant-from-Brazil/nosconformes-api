import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { companiesServices } from './services';

@Module({
  providers: [...companiesServices],
  controllers: [CompaniesController],
})
export class CompaniesModule {}
