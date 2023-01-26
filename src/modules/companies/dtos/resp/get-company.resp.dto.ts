import { Employee } from 'src/modules/employees/employee.entity';
import { User } from 'src/modules/users/users.entity';
import { Company } from '../../companies.entity';

export type GetCompanyRespDTO = {
	company: Company & { manager?: Employee };
	availableAuditors: User[];
};
