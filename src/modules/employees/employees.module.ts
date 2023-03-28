import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { employeesControllers } from './controllers';
import { Employee } from './employee.entity';
import { employeesServices } from './services';

@Module({
	imports: [TypeOrmModule.forFeature([Employee])],
	controllers: [...employeesControllers],
	providers: [...employeesServices],
})
export class EmployeesModule {}
