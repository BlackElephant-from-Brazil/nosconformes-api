import { Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateMainUserService } from '../services/create.main.user.service';

@Controller('main-user')
export class MainUserController {
	constructor(
		private readonly createMainUserService: CreateMainUserService,
	) {}

	@Post('')
	async create(@Res() res: Response) {
		const createdUser = await this.createMainUserService.execute();
		res.json(createdUser).status(HttpStatus.CREATED);
	}
}
