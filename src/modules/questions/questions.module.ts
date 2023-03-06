import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { questionsControllers } from './controllers';
import { Question } from './question.entity';
import { questionsServices } from './services';

@Module({
	imports: [TypeOrmModule.forFeature([Question])],
	providers: [...questionsServices],
	controllers: [...questionsControllers],
})
export class QuestionsModule {}
