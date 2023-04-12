import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../companies/companies.entity';
import { Grouping } from '../groupings/grouping.entity';
import { User } from '../users/users.entity';
import { questionariesController } from './controllers';
import { Questionary } from './questionary.entity';
import { questionariesService } from './services';
import { Employee } from '../employees/employee.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Questionary,
			User,
			Company,
			Grouping,
			Employee,
		]),
	],
	providers: [...questionariesService],
	controllers: [...questionariesController],
})
export class QuestionariesModule {}
