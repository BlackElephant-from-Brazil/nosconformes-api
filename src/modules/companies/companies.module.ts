import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './companies.entity';
import { companiesServices } from './services';
import { Employee } from '../employees/employee.entity';
import { companiesControllers } from './controllers';
import { EmployeesModule } from '../employees/employees.module';
import { User } from '../users/users.entity';

@Module({
	imports: [
		EmployeesModule,
		TypeOrmModule.forFeature([Company, Employee, User]),
	],
	providers: [...companiesServices],
	controllers: [...companiesControllers],
})
export class CompaniesModule {}
