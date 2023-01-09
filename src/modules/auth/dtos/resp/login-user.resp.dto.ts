import { Response } from 'src/interfaces/response';
import { User } from 'src/modules/users/users.entity';

export class LoginUserRespDTO implements Response {
  _success: boolean;
  user: Omit<User, 'password'>;
  accessToken: string;
}
