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

@ApiTags('Authentication')
@Controller('auth')
export class ChangePasswordController {
	constructor(private changePasswordService: ChangePasswordService) {}

	@Post('change-password')
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
	async changePassword(
		@Body() newPasswordDTO: NewPasswordReqDTO,
		@Res() res: Response,
	) {
		if (newPasswordDTO.password !== newPasswordDTO.passwordConfirmation)
			throw new BadRequestException(
				'A confirmação de senha precisa ser igual a senha.',
			);
		const user = await this.changePasswordService.execute(newPasswordDTO);

		res.json(user).status(HttpStatus.OK);
	}
}
