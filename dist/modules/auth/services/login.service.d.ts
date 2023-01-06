import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/users/users.entity';
import { BCryptProvider } from 'src/providers/encriptation/bcrypt.provider';
import { Repository } from 'typeorm';
import { LoginUserRespDTO } from '../dtos/resp/login-user.resp.dto';
import { LoginUserReqDTO } from '../dtos/req/login-user.req.dto';
export declare class LoginService {
    private usersRepository;
    private jwtService;
    private hashProvider;
    constructor(usersRepository: Repository<User>, jwtService: JwtService, hashProvider: BCryptProvider);
    execute({ email, password, }: LoginUserReqDTO): Promise<LoginUserRespDTO>;
}
