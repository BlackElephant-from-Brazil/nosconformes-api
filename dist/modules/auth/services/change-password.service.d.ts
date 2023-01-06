import { User } from 'src/modules/users/users.entity';
import { BCryptProvider } from 'src/providers/encriptation/bcrypt.provider';
import { Repository } from 'typeorm';
import { NewPasswordReqDTO } from '../dtos/req/new-password.req.dto';
import { NewPasswordRespDTO } from '../dtos/resp/new-password.resp.dto';
export declare class ChangePasswordService {
    private usersRepository;
    private hashProvider;
    constructor(usersRepository: Repository<User>, hashProvider: BCryptProvider);
    execute({ email, password, passwordConfirmation, }: NewPasswordReqDTO): Promise<NewPasswordRespDTO>;
}
