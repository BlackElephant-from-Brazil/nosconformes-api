import { AddGroupingToQuestionaryService } from './add-grouping-to-questionary.service';
import { CreateQuestionaryService } from './create-questionary.service';
import { DeleteGroupingFromQuestionaryService } from './delete-grouping-from-questionary.service';
import { EditQuestionaryService } from './edit-questionary.service';
import { FindAllQuestionariesFromCompanyByIdService } from './find-all-questionaries-from-company-by-id.service';
import { FindAvailableCompaniesFromQuestionaryService } from './find-available-companies-from-questionary.service';
import { FindAvailableGroupingsFromQuestionaryService } from './find-available-groupings-from-questionary.service';
import { FindQuestionariesService } from './find-questionaries.service';
import { FindQuestionaryByIdService } from './find-questionary-by-id.service';
import { UpdateCompaniesFromQuestionaryService } from './update-companies-from-questionary.service';

export const questionariesService = [
	FindQuestionariesService,
	CreateQuestionaryService,
	EditQuestionaryService,
	FindQuestionaryByIdService,
	FindAvailableCompaniesFromQuestionaryService,
	UpdateCompaniesFromQuestionaryService,
	DeleteGroupingFromQuestionaryService,
	FindAvailableGroupingsFromQuestionaryService,
	AddGroupingToQuestionaryService,
	FindAllQuestionariesFromCompanyByIdService,
];
