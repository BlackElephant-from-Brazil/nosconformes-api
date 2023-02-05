import {
	Controller,
	Post,
	Res,
	HttpStatus,
	Body,
	InternalServerErrorException,
	BadRequestException,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { NewPasswordReqDTO } from '../dtos/req/new-password.req.dto';
import { NewPasswordRespDTO } from '../dtos/resp/new-password.resp.dto';
import { ChangePasswordService } from '../services/change-password.service';
import { ForgotPasswordService } from '../services/forgot-password.service';

@ApiTags('Authentication')
@Controller('password')
export class PasswordController {
	constructor(
		private changePasswordService: ChangePasswordService,
		private forgotPasswordService: ForgotPasswordService,
	) {}

	@Post('change')
	@ApiOkResponse({
		description: 'User changed correctly the password.',
		type: NewPasswordRespDTO,
	})
	@ApiBadRequestResponse({
		description: 'User do not send the data correctly',
		type: BadRequestException,
	})
	@ApiInternalServerErrorResponse({
		description: 'Occurred some internal error.',
		type: InternalServerErrorException,
	})
	async update(
		@Body() newPasswordDTO: NewPasswordReqDTO,
		@Res() res: Response,
	) {
		const user = await this.changePasswordService.execute(newPasswordDTO);

		res.json(user).status(HttpStatus.OK);
	}

	@Post('forgot')
	async forgot(@Body() { email }: { email: string }, @Res() res: Response) {
		await this.forgotPasswordService.execute(email);

		res.status(HttpStatus.OK).send();
	}
}
