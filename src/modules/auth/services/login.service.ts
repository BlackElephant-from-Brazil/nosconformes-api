import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/users.entity';
import { Repository } from 'typeorm';
import { LoggedUserDTO } from '../dtos/logged-user.dto';
import { LoginUserDTO } from '../dtos/login-user.dto';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
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
      throw new Error('Internal server error');
    }

    if (!user) throw new Error('Oops! Email or password does not match!');

    if (user.password !== password)
      throw new Error('Oops! Email or password does not match!');

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
