import { User } from 'src/modules/users/users.entity';

export class LoginUserRespDTO {
	user: Omit<User, 'password'>;
	accessToken: string;
}
