import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../questions/question.entity';
import { Answer } from './answer.entity';
import { answersControllers } from './controllers';
import { answersServices } from './services';
import { AccordingButtonFile } from '../according-button-files/according-button-file.entity';
import { Employee } from '../employees/employee.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Answer,
			Question,
			Employee,
			AccordingButtonFile,
		]),
	],
	controllers: [...answersControllers],
	providers: [...answersServices],
})
export class AnswersModule {}
