import { CreateQuestionService } from './create-question.service';
import { FindQuestionByIdService } from './find-question-by-id.service';
import { FindQuestionsService } from './find-questions.service';

export const questionsServices = [
	CreateQuestionService,
	FindQuestionsService,
	FindQuestionByIdService,
];
