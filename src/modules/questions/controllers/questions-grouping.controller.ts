import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	Query,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserInfo } from 'src/interfaces/user-info.type';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { FindQuestionsFromGroupingFromCompanyService } from '../services/find-questions-from-grouping-from-company.service';

@UseGuards(JwtAuthGuard)
@Controller('questions')
export class QuestionsGroupingController {
	constructor(
		private readonly findQuestionsFromGroupingFromCompanySerivce: FindQuestionsFromGroupingFromCompanyService,
	) {}

	@Get(':groupingId/grouping')
	async find(
		@Req() req: Request,
		@Param('groupingId') groupingId: string,
		@Res() res: Response,
	) {
		const { userId: employeeId } = req.user as UserInfo;
		const questions =
			await this.findQuestionsFromGroupingFromCompanySerivce.execute(
				groupingId,
				employeeId,
			);
		res.json(questions).status(HttpStatus.OK);
	}
}
