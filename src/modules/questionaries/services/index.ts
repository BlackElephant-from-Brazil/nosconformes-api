import { CreateQuestionaryService } from './create-questionary.service';
import { EditQuestionaryService } from './edit-questionary.service';
import { FindAvailableAuditorsForQuestionaryService } from './find-available-auditors-for-questionary.service';
import { FindQuestionariesService } from './find-questionaries.service';
import { FindQuestionaryByIdService } from './find-questionary-by-id.service';
import { UpdateAuditorFromQuestionaryService } from './update-auditor-from-questionary.service';

export const questionariesService = [
	FindQuestionariesService,
	CreateQuestionaryService,
	EditQuestionaryService,
	FindQuestionaryByIdService,
	FindAvailableAuditorsForQuestionaryService,
	UpdateAuditorFromQuestionaryService,
];
