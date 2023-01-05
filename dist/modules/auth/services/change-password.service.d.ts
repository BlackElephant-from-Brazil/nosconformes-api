import { User } from 'src/modules/users/users.entity';
import { GenerateHash } from 'src/providers/encriptation/bcrypt.provider';
import { Repository } from 'typeorm';
import { NewPasswordDTO } from '../dtos/new-password.dto';
export declare class ChangePasswordService {
    private usersRepository;
    private generateHash;
    constructor(usersRepository: Repository<User>, generateHash: GenerateHash);
    execute({ email, password, passwordConfirmation, }: NewPasswordDTO): Promise<User>;
}
