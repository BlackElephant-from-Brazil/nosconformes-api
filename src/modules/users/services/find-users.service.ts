import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from '../users.entity';

@Injectable()
export class FindUsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async execute(query?: string): Promise<User[]> {
    const resolvedQuery = query ? `%${query}%` : '%%';
    const findUsers = await this.usersRepository.find({
      where: [
        {
          accessLevel: ILike(resolvedQuery),
        },
        {
          email: ILike(resolvedQuery),
        },
        {
          name: ILike(resolvedQuery),
        },
        {
          office: ILike(resolvedQuery),
        },
      ],
    });

    findUsers.forEach((u) => delete u.password);

    return findUsers;
  }
}
