import { Repository } from 'typeorm';
import { User } from '../users.entity';
export declare class FindUsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    execute(query?: string): Promise<User[]>;
}
