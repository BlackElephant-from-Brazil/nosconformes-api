import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questionary } from '../questionaries/questionary.entity';
import { Question } from '../questions/question.entity';
import { Grouping } from './grouping.entity';
import { groupingsService } from './services';
import { groupingsControllers } from './controllers';
import { Employee } from '../employees/employee.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Grouping, Questionary, Question, Employee]),
	],
	providers: [...groupingsService],
	controllers: [...groupingsControllers],
})
export class GroupingsModule {}
