import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ManagersModule } from '../managers/managers.module';
import { companyProviders } from './companies.provider';
import { CompaniesController } from './company.controller';
import { CompaniesService } from './company.service';

@Module({
  imports: [ManagersModule, DatabaseModule],
  controllers: [CompaniesController],
  providers: [CompaniesService, ...companyProviders],
})
export class CompaniesModule {}
