import { FindMessagesFromQuestionFromCompanyService } from './find-messages-from-question-from-company.service';
import { HasUnreadMessagesFromQuestionFromCompanyForAuditorService } from './has-unread-messages-from-question-from-company-for-auditor.service';
import { HasUnreadMessagesFromQuestionFromCompanyForEmployeeService } from './has-unread-messages-from-question-from-company-for-employee.service';
import { RegisterMessageService } from './register-message.service';
import { UpdateMessageAsReadForAuditorService } from './update-message-as-read-for-auditor.service';
import { UpdateMessageAsReadForEmployeeService } from './update-message-as-read-for-employee.service';

export const messagesServices = [
	FindMessagesFromQuestionFromCompanyService,
	RegisterMessageService,
	HasUnreadMessagesFromQuestionFromCompanyForAuditorService,
	HasUnreadMessagesFromQuestionFromCompanyForEmployeeService,
	UpdateMessageAsReadForAuditorService,
	UpdateMessageAsReadForEmployeeService,
];
