import {
	Controller,
	Get,
	HttpStatus,
	Param,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { FindAllGroupingsFromQuestionaryForCompanyService } from '../services/find-all-groupings-from-questionary-for-company.service';

@UseGuards(JwtAuthGuard)
@Controller('groupings')
export class GroupingCompanyController {
	constructor(
		private readonly findAllGroupingsFromQuestionaryForCompanyService: FindAllGroupingsFromQuestionaryForCompanyService,
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
}
