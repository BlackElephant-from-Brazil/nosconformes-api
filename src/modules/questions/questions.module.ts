import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from './questions.controller';
import { Question } from './question.entity';
import { questionsServices } from './services';

@Module({
	imports: [TypeOrmModule.forFeature([Question])],
	providers: [...questionsServices],
	controllers: [QuestionsController],
})
export class QuestionsModule {}
