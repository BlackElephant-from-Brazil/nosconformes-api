import {
	Controller,
	Get,
	HttpStatus,
	Param,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserInfo } from 'src/interfaces/user-info.type';
import { FindActionPlanForCompanyService } from '../services/find-action-plan-for-company.service';

@UseGuards(JwtAuthGuard)
@Controller('action-plan')
export class ActionPlanController {
	constructor(
		private readonly findActionPlanForCompanyService: FindActionPlanForCompanyService,
	) {}

	@Get('')
	async read(@Req() req: Request, @Res() res: Response) {
		const { userId: employeeId } = req.user as UserInfo;
		const actionPlan = await this.findActionPlanForCompanyService.execute(
			employeeId,
		);
		res.json(actionPlan).status(HttpStatus.OK);
	}
}
