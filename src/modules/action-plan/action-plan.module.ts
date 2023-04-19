import { Module } from '@nestjs/common';
import { actionPlanServices } from './services';
import { actionPlanControllers } from './controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../questions/question.entity';
import { Employee } from '../employees/employee.entity';
import { Questionary } from '../questionaries/questionary.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Question, Employee, Questionary])],
	controllers: [...actionPlanControllers],
	providers: [...actionPlanServices],
})
export class ActionPlanModule {}
