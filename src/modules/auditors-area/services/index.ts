import { FindAvailableCompaniesForAuditor } from './find-available-companies-for-auditor.service';
import { FindAvailableQuestionariesForAuditor } from './find-available-questionaries-for-auditor.service';

export const auditorsAreaServices = [
	FindAvailableCompaniesForAuditor,
	FindAvailableQuestionariesForAuditor,
];
