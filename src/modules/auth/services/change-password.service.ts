import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HASH } from 'src/config/constants';
import { User } from 'src/modules/users/users.entity';
import { GenerateHash } from 'src/providers/encriptation/bcrypt.provider';
import { Repository } from 'typeorm';
import { NewPasswordDTO } from '../dtos/new-password.dto';

@Injectable()
export class ChangePasswordService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(HASH)
    private generateHash: GenerateHash,
  ) {}

  async execute({
    email,
    password,
    passwordConfirmation,
  }: NewPasswordDTO): Promise<User> {
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

    const hashedPassword = await this.generateHash({
      password,
    });

    user.password = hashedPassword;

    try {
      await this.usersRepository.save(user);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    return user;
  }
}
