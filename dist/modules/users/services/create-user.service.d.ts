import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { User } from '../users.entity';
export declare class CreateUserService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    execute({ profilePicture, name, email, password, office, accessLevel, }: CreateUserDTO): Promise<User>;
}
