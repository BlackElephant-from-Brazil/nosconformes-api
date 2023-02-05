import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('app')
export class AppController {
	@Get()
	async test(@Res() res: Response) {
		res.json({
			message: 'Hello World',
		}).status(HttpStatus.OK);
	}
}
