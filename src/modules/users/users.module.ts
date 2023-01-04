import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserService } from './services/create-user.service';
import { FindUsersService } from './services/find-users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [CreateUserService, FindUsersService],
  controllers: [UsersController],
})
export class UsersModule {}
