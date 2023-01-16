import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesController } from './controllers/companies.controller';
import { Company } from './companies.entity';
import { companiesServices } from './services';

@Module({
	imports: [TypeOrmModule.forFeature([Company])],
	providers: [...companiesServices],
	controllers: [CompaniesController],
})
export class CompaniesModule {}
