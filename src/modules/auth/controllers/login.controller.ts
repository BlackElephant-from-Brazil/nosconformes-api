import {
	Controller,
	Post,
	UseGuards,
	Res,
	HttpStatus,
	Req,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { RequestWithUser } from 'src/interfaces/request-with-user';
import { LocalAuthGuard } from '../guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class LoginController {
	@UseGuards(LocalAuthGuard)
	@ApiOkResponse()
	@ApiBadRequestResponse()
	@ApiInternalServerErrorResponse()
	@Post('login')
	async create(@Req() req: RequestWithUser, @Res() res: Response) {
		res.json(req.authenticated).status(HttpStatus.OK);
	}
}
