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
import { UserInfo } from 'src/interfaces/user-info.type';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { FindAllGroupingsFromQuestionaryForCompanyService } from '../services/find-all-groupings-from-questionary-for-company.service';
import { FindGroupingByIdForCompanyService } from '../services/find-grouping-by-id-for-company.service';

@UseGuards(JwtAuthGuard)
@Controller('groupings')
export class GroupingCompanyController {
	constructor(
		private readonly findAllGroupingsFromQuestionaryForCompanyService: FindAllGroupingsFromQuestionaryForCompanyService,
		private readonly findGroupingByIdForCompanyService: FindGroupingByIdForCompanyService,
	) {}

	@Get(':questionaryId/questionary/:companyId/company')
	async find(
		@Param('questionaryId') questionaryId: string,
		@Param('companyId') companyId: string,
		@Res() res: Response,
	) {
		const groupings =
			await this.findAllGroupingsFromQuestionaryForCompanyService.execute(
				questionaryId,
				companyId,
			);
		res.json(groupings).status(HttpStatus.OK);
	}

	@Get(':groupingId/company')
	async show(
		@Req() req: Request,
		@Param('groupingId') groupingId: string,
		@Res() res: Response,
	) {
		const { userId: employeeId } = req.user as UserInfo;
		const grouping = await this.findGroupingByIdForCompanyService.execute(
			groupingId,
			employeeId,
		);
		res.json(grouping).status(HttpStatus.OK);
	}
}
