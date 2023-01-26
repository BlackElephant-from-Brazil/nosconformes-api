import { Company } from 'src/modules/companies/companies.entity';
import { v4 } from 'uuid';
import { Employee } from '../employee.entity';

type CreateEmployee = {
	_eq?: string;
	companyId: string;
};

export const newEmployee = ({ _eq, companyId }: CreateEmployee): Employee => {
	return {
		_eq: _eq ? _eq : v4(),
		accessLevel: 'manager',
		companyId: companyId,
		department: 'TI',
		email: 'valid@managermail.com',
		name: 'Manager Valid Name',
		office: 'Gerente de Projetos',
		password: 'V@l1dPassword',
		phone: '19995545043',
		company: {} as Company,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
};
