import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/users.entity';
import { BCryptProvider } from 'src/providers/encriptation/bcrypt.provider';
import { Repository } from 'typeorm';
import { NewPasswordReqDTO } from '../dtos/req/new-password.req.dto';
import { NewPasswordRespDTO } from '../dtos/resp/new-password.resp.dto';

@Injectable()
export class ChangePasswordService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashProvider: BCryptProvider,
  ) {}

  async execute({
    email,
    password,
    passwordConfirmation,
  }: NewPasswordReqDTO): Promise<NewPasswordRespDTO> {
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

    if (!user) throw new Error('User not found');

    if (password !== passwordConfirmation)
      throw new Error('Passwords does not match');

    const hashedPassword = await this.hashProvider.hash({
      password,
    });

    user.password = hashedPassword;

    try {
      await this.usersRepository.save(user);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    delete user.password;

    return {
      _success: true,
      user,
    };
  }
}
