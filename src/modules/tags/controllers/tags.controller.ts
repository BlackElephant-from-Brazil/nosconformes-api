import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { FindTagsService } from '../services/find-tags.service';

@UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagsController {
	constructor(private readonly findTagsService: FindTagsService) {}

	@Get()
	async read(@Res() res: Response) {
		const tags = await this.findTagsService.execute();
		res.json(tags).status(HttpStatus.OK);
	}
}
