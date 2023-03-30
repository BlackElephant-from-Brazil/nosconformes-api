import { AddQuestionsToGroupingService } from './add-questions-to-grouping.service';
import { CreateGroupingService } from './create-grouping.service';
import { UpdatingGroupingNameService } from './updating-grouping-name.service';
import { FindAllGroupingsService } from './find-all-groupings.service';
import { FindGroupingByIdService } from './find-grouping-by-id.service';
import { RemoveQuestionsFromGroupingService } from './remove-questions-from-grouping.service';
import { FindAllGroupingsFromQuestionaryForCompanyService } from './find-all-groupings-from-questionary-for-company.service';

export const groupingsService = [
	CreateGroupingService,
	UpdatingGroupingNameService,
	FindGroupingByIdService,
	AddQuestionsToGroupingService,
	FindAllGroupingsService,
	RemoveQuestionsFromGroupingService,
	FindAllGroupingsFromQuestionaryForCompanyService,
];
