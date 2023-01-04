import { Repository } from 'typeorm';
import { User } from '../users.entity';
export declare class FindUserByEmailService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    execute(email: string): Promise<User>;
}
