import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { FindReferencesService } from '../services/find-references.service';

@UseGuards(JwtAuthGuard)
@Controller('references')
export class ReferencesController {
	constructor(
		private readonly findReferencesService: FindReferencesService,
	) {}

	@Get()
	async read(@Res() res: Response) {
		const references = await this.findReferencesService.execute();
		res.json(references).status(HttpStatus.OK);
	}
}
