import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { User } from '../users.entity';

@Injectable()
export class CreateUserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async execute({
    profilePicture,
    name,
    email,
    password,
    office,
    accessLevel,
  }: CreateUserDTO): Promise<User> {
    //TODO: HASHEAR A SENHA
    const createdUser = this.usersRepository.create({
      profilePicture,
      name,
      email,
      password,
      office,
      accessLevel,
    });

    await this.usersRepository.save(createdUser);

    return createdUser;
  }
}
