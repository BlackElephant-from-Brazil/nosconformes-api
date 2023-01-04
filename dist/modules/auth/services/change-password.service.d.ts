import { User } from 'src/modules/users/users.entity';
import { Repository } from 'typeorm';
import { NewPasswordDTO } from '../dtos/new-password.dto';
export declare class ChangePasswordService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    execute({ email, password, passwordConfirmation, }: NewPasswordDTO): Promise<User>;
}
