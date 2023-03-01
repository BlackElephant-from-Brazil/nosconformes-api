import { AddQuestionsToGroupingService } from './add-questions-to-grouping.service';
import { CreateGroupingService } from './create-grouping.service';
import { EditGroupingService } from './edit-grouping.service';
import { FindAllGroupingsService } from './find-all-groupings.service';
import { FindGroupingByIdService } from './find-grouping-by-id.service';
import { RemoveQuestionsFromGroupingService } from './remove-questions-from-grouping.service';

export const groupingsService = [
	CreateGroupingService,
	EditGroupingService,
	FindGroupingByIdService,
	AddQuestionsToGroupingService,
	FindAllGroupingsService,
	RemoveQuestionsFromGroupingService,
];
