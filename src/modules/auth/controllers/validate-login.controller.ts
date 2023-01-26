import { Controller, UseGuards, Res, HttpStatus, Get } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class ValidateLoginController {
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse()
	@ApiBadRequestResponse()
	@ApiInternalServerErrorResponse()
	@ApiUnauthorizedResponse()
	@Get('validate')
	async login(@Res() res: Response) {
		res.status(HttpStatus.OK).send();
	}
}
