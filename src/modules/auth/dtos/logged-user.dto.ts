import { User } from 'src/modules/users/users.entity';

export type LoggedUserDTO = {
  user: User;
  accessToken: string;
};
