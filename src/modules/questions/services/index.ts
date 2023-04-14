import { CreateQuestionService } from './create-question.service';
import { DeleteEmployeesInQuestionsService } from './delete-employees-in-questions.service';
import { FindQuestionByIdService } from './find-question-by-id.service';
import { FindQuestionsFromGroupingFromCompanyService } from './find-questions-from-grouping-from-company.service';
import { FindQuestionsService } from './find-questions.service';
import { GenerateNewIdService } from './generate-new-id.service';
import { UpdateEmployeesInQuestionsService } from './update-employees-in-questions.service';

export const questionsServices = [
	CreateQuestionService,
	FindQuestionsService,
	FindQuestionByIdService,
	GenerateNewIdService,
	FindQuestionsFromGroupingFromCompanyService,
	UpdateEmployeesInQuestionsService,
	DeleteEmployeesInQuestionsService,
];
