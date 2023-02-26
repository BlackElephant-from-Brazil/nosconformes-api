import { CreateQuestionaryService } from './create-questionary.service';
import { DeleteGroupingFromQuestionaryService } from './delete-grouping-from-questionary.service';
import { EditQuestionaryService } from './edit-questionary.service';
import { FindAvailableAuditorsForQuestionaryService } from './find-available-auditors-for-questionary.service';
import { FindAvailableCompaniesFromQuestionaryService } from './find-available-companies-from-questionary.service';
import { FindQuestionariesService } from './find-questionaries.service';
import { FindQuestionaryByIdService } from './find-questionary-by-id.service';
import { UpdateAuditorFromQuestionaryService } from './update-auditor-from-questionary.service';
import { UpdateCompaniesFromQuestionaryService } from './update-companies-from-questionary.service';

export const questionariesService = [
	FindQuestionariesService,
	CreateQuestionaryService,
	EditQuestionaryService,
	FindQuestionaryByIdService,
	FindAvailableAuditorsForQuestionaryService,
	UpdateAuditorFromQuestionaryService,
	FindAvailableCompaniesFromQuestionaryService,
	UpdateCompaniesFromQuestionaryService,
	DeleteGroupingFromQuestionaryService,
];
