import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UpdateUserDTO } from '../companies/dtos/req/update-user.dto';
import { CreateUserDTO } from './dtos/create-user.dto';
import { CreateUserService } from './services/create-user.service';
import { DeleteUserService } from './services/delete-user.service';
import { FindUserByIdService } from './services/find-user-by-id.service';
import { FindUsersService } from './services/find-users.service';
import { UpdateUserService } from './services/update-user.service';

@Controller('users')
export class UsersController {
	constructor(
		private readonly createUserService: CreateUserService,
		private readonly findUsersService: FindUsersService,
		private readonly updateUserService: UpdateUserService,
		private readonly deleteUserService: DeleteUserService,
		private readonly findUserByIdService: FindUserByIdService,
	) {}

	// TODO: INSERT ALL JWT VALIDATIONS

	@Post()
	async create(@Body() createUserDTO: CreateUserDTO, @Res() res: Response) {
		const createdUser = await this.createUserService.execute(createUserDTO);
		res.json(createdUser).status(HttpStatus.CREATED);
	}

	@Get()
	async read(@Query('query') query: string, @Res() res: Response) {
		const users = await this.findUsersService.execute(query);
		res.json(users).status(HttpStatus.OK);
	}

	@Put(':id')
	async update(
		@Param('id') userId: string,
		@Body() updateUserDto: UpdateUserDTO,
		@Res() res: Response,
	) {
		const users = await this.updateUserService.execute(
			userId,
			updateUserDto,
		);
		res.json(users).status(HttpStatus.OK);
	}

	@Delete(':id')
	async delete(@Param('id') userId: string, @Res() res: Response) {
		const users = await this.deleteUserService.execute(userId);
		res.json(users).status(HttpStatus.OK);
	}

	@Get(':id')
	async show(@Param('id') userId: string, @Res() res: Response) {
		const users = await this.findUserByIdService.execute(userId);
		res.json(users).status(HttpStatus.OK);
	}
}
