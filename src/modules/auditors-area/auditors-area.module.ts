import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../companies/companies.entity';
import { Questionary } from '../questionaries/questionary.entity';
import { User } from '../users/users.entity';
import { auditorsAreaControllers } from './controllers';
import { auditorsAreaServices } from './services';

@Module({
	imports: [TypeOrmModule.forFeature([Company, User, Questionary])],
	providers: [...auditorsAreaServices],
	controllers: [...auditorsAreaControllers],
})
export class AuditorsAreaModule {}
