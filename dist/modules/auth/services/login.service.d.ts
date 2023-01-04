import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/users/users.entity';
import { Repository } from 'typeorm';
import { LoggedUserDTO } from '../dtos/logged-user.dto';
import { LoginUserDTO } from '../dtos/login-user.dto';
export declare class LoginService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    execute({ email, password }: LoginUserDTO): Promise<LoggedUserDTO>;
}
