import { BCryptProvider } from 'src/providers/encriptation/bcrypt.provider';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { User } from '../users.entity';
export declare class CreateUserService {
    private usersRepository;
    private hashProvider;
    constructor(usersRepository: Repository<User>, hashProvider: BCryptProvider);
    execute({ profilePicture, name, email, password, office, accessLevel, }: CreateUserDTO): Promise<User>;
}
