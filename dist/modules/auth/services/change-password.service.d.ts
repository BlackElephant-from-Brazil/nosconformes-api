import { User } from 'src/modules/users/users.entity';
import { BCryptProvider } from 'src/providers/encriptation/bcrypt.provider';
import { Repository } from 'typeorm';
import { NewPasswordDTO } from '../dtos/new-password.dto';
export declare class ChangePasswordService {
    private usersRepository;
    private hashProvider;
    constructor(usersRepository: Repository<User>, hashProvider: BCryptProvider);
    execute({ email, password, passwordConfirmation, }: NewPasswordDTO): Promise<User>;
}
