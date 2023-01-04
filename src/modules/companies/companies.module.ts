import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CreateCompanyService } from './services/create-company.service';

@Module({
  providers: [CreateCompanyService],
  controllers: [CompaniesController],
})
export class CompaniesModule {}
