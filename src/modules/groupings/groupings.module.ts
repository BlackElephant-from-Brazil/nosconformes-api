import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questionary } from '../questionaries/questionary.entity';
import { Question } from '../questions/question.entity';
import { Grouping } from './grouping.entity';
import { GroupingController } from './groupings.controller';
import { groupingsService } from './services';

@Module({
	imports: [TypeOrmModule.forFeature([Grouping, Questionary, Question])],
	providers: [...groupingsService],
	controllers: [GroupingController],
})
export class GroupingsModule {}
