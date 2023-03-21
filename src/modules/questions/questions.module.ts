import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccordingButton } from '../according-buttons/according-button.entity';
import { Grouping } from '../groupings/grouping.entity';
import { PartialAccordingButton } from '../partial-according-buttons/partial-according-button.entity';
import { Reference } from '../references/reference.entity';
import { Tag } from '../tags/tag.entity';
import { questionsControllers } from './controllers';
import { Question } from './question.entity';
import { questionsServices } from './services';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Question,
			Tag,
			Reference,
			AccordingButton,
			PartialAccordingButton,
			Grouping,
		]),
	],
	providers: [...questionsServices],
	controllers: [...questionsControllers],
})
export class QuestionsModule {}
