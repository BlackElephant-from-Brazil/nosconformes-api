import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HASH } from 'src/config/constants';
import { GenerateHash } from 'src/providers/encriptation/bcrypt.provider';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { User } from '../users.entity';

@Injectable()
export class CreateUserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(HASH)
    private generateHash: GenerateHash,
  ) {}

  async execute({
    profilePicture,
    name,
    email,
    password,
    office,
    accessLevel,
  }: CreateUserDTO): Promise<User> {
    const hashedPassword = await this.generateHash({
      password,
    });

    const createdUser = this.usersRepository.create({
      profilePicture,
      name,
      email,
      password: hashedPassword,
      office,
      accessLevel,
    });

    await this.usersRepository.save(createdUser);

    return createdUser;
  }
}
