import { GenerateHash } from 'src/providers/encriptation/bcrypt.provider';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { User } from '../users.entity';
export declare class CreateUserService {
    private usersRepository;
    private generateHash;
    constructor(usersRepository: Repository<User>, generateHash: GenerateHash);
    execute({ profilePicture, name, email, password, office, accessLevel, }: CreateUserDTO): Promise<User>;
}
