import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/users.entity';
import { Repository } from 'typeorm';
import { NewPasswordDTO } from '../dtos/new-password.dto';

@Injectable()
export class ChangePasswordService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
      throw new Error('Internal server error');
    }

    if (!user) throw new Error('User not found');

    if (password !== passwordConfirmation)
      throw new Error('Passwords does not match');

    user.password = password;

    try {
      await this.usersRepository.save(user);
    } catch (e) {
      throw new Error('Internal server error');
    }

    return user;
  }
}
