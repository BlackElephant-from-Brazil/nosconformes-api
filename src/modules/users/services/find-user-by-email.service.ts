import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users.entity';

@Injectable()
export class FindUserByEmailService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async execute(email: string): Promise<User> {
    const findUser = await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });

    return findUser;
  }
}
