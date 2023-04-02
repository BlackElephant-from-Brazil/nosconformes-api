import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../questions/question.entity';
import { Answer } from './answer.entity';
import { answersControllers } from './controllers';
import { answersServices } from './services';

@Module({
	imports: [TypeOrmModule.forFeature([Answer, Question])],
	controllers: [...answersControllers],
	providers: [...answersServices],
})
export class AnswersModule {}
