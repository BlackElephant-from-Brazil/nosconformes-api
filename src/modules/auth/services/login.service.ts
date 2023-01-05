import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { COMPARE } from 'src/config/constants';
import { User } from 'src/modules/users/users.entity';
import { CompareHash } from 'src/providers/encriptation/bcrypt.provider';
import { Repository } from 'typeorm';
import { LoggedUserDTO } from '../dtos/logged-user.dto';
import { LoginUserDTO } from '../dtos/login-user.dto';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(COMPARE)
    private compareHash: CompareHash,
  ) {}

  async execute({ email, password }: LoginUserDTO): Promise<LoggedUserDTO> {
    let user: User;
    try {
      user = await this.usersRepository.findOne({
        where: {
          email,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }

    if (!user) throw new Error('Oops! Email or password does not match!');

    const passwordValidated = await this.compareHash({
      storedPassword: user.password,
      typedPassword: password,
    });

    if (!passwordValidated)
      throw new Error('Oops! Email or password does not match!');

    delete user.password;

    const payload = {
      email: user.email,
      sub: user._eq,
    };

    const accessToken = this.jwtService.sign(payload);

    const loggedUser: LoggedUserDTO = {
      user,
      accessToken,
    };

    return loggedUser;
  }
}
