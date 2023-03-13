import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserInfo } from 'src/interfaces/user-info.type';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { FindAvailableCompaniesForAuditor } from '../services/find-available-companies-for-auditor.service';
import { FindAvailableQuestionariesForAuditor } from '../services/find-available-questionaries-for-auditor.service';

@Controller('auditors-area')
export class AuditorsAreaController {
	constructor(
		private readonly findAvailableCompaniesForAuditor: FindAvailableCompaniesForAuditor,
		private readonly findAvailableQuestionariesForAuditor: FindAvailableQuestionariesForAuditor,
	) {}

	@UseGuards(JwtAuthGuard)
	@Get('companies')
	async findCompanies(
		@Query('query') query: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const { userId } = req.user as UserInfo;
		const foundCompanies =
			await this.findAvailableCompaniesForAuditor.execute(userId, query);
		res.json(foundCompanies).status(HttpStatus.OK);
	}

	@UseGuards(JwtAuthGuard)
	@Get('questionaries/:companyId')
	async findQuestionaries(
		@Req() req: Request,
		@Param('companyId') companyId: string,
		@Res() res: Response,
	) {
		const { userId } = req.user as UserInfo;
		const foundQuestionaries =
			await this.findAvailableQuestionariesForAuditor.execute(
				userId,
				companyId,
			);
		res.json(foundQuestionaries).status(HttpStatus.OK);
	}
}
