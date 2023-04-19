import { Employee } from 'src/modules/employees/employee.entity';

export type UpdateEmployeesInQuestionsDTO = {
	questionIds: string[];
	employees: Employee[];
};
