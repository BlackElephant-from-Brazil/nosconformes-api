import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/users/users.entity';
import { CompareHash } from 'src/providers/encriptation/bcrypt.provider';
import { Repository } from 'typeorm';
import { LoggedUserDTO } from '../dtos/logged-user.dto';
import { LoginUserDTO } from '../dtos/login-user.dto';
export declare class LoginService {
    private usersRepository;
    private jwtService;
    private compareHash;
    constructor(usersRepository: Repository<User>, jwtService: JwtService, compareHash: CompareHash);
    execute({ email, password }: LoginUserDTO): Promise<LoggedUserDTO>;
}
