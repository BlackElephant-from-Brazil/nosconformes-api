import { QuestionariesCompanyController } from './questionaries-company.controller';
import { QuestionariesEmployeesController } from './questionaries-employees.controller';
import { QuestionariesController } from './questionaries.controller';
import { UpdateQuestionaryController } from './update-questionary.controller';

export const questionariesController = [
	QuestionariesController,
	UpdateQuestionaryController,
	QuestionariesCompanyController,
	QuestionariesEmployeesController,
];
