import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDTO } from './dtos/create-user.dto';
import { CreateUserService } from './services/create-user.service';
import { FindUsersService } from './services/find-users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly findUsersService: FindUsersService,
  ) {}

  @Post()
  async create(@Body() user: CreateUserDTO, @Res() res: Response) {
    const createdUser = await this.createUserService.execute(user);
    res.json(createdUser).status(HttpStatus.CREATED);
  }

  @Get()
  async read(@Query('query') query: string, @Res() res: Response) {
    const user = await this.findUsersService.execute(query);
    res.json(user).status(HttpStatus.OK);
  }
}
