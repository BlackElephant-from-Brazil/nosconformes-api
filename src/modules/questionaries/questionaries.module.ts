import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { questionariesController } from './controllers';
import { Questionary } from './questionary.entity';
import { questionariesService } from './services';

@Module({
	imports: [TypeOrmModule.forFeature([Questionary, User])],
	providers: [...questionariesService],
	controllers: [...questionariesController],
})
export class QuestionariesModule {}
