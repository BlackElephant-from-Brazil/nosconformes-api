import { Employee } from 'src/modules/employees/employee.entity';
import { User } from 'src/modules/users/users.entity';

export class LoginUserRespDTO {
	user?: Omit<User, 'password'>;
	employee?: Omit<Employee, 'password'>;
	accessToken: string;
}
