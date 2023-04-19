import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './companies.entity';
import { companiesServices } from './services';
import { Employee } from '../employees/employee.entity';
import { companiesControllers } from './controllers';
import { EmployeesModule } from '../employees/employees.module';
import { User } from '../users/users.entity';
import { BCryptProvider } from 'src/providers/encriptation/bcrypt.provider';

@Module({
	imports: [
		EmployeesModule,
		TypeOrmModule.forFeature([Company, Employee, User]),
	],
	providers: [...companiesServices, BCryptProvider],
	controllers: [...companiesControllers],
})
export class CompaniesModule {}
