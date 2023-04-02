import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';

@Controller('uploads')
export class UploadsController {
	@Get(':filename')
	async serveImage(
		@Param('filename') filename: string,
		@Res() res: Response,
	): Promise<any> {
		const path = join(__dirname, '..', 'uploads', filename);
		if (fs.existsSync(path)) {
			return res.sendFile(path);
		} else {
			return res.status(404).send({ message: 'File not found' });
		}
	}
}
