import {
	Controller,
	Get,
	HttpStatus,
	Param,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FindAnswersFromCompanyFromGroupingService } from '../services/find-answers-from-company-from-grouping.service';

@UseGuards(JwtAuthGuard)
@Controller('answers')
export class AnswersController {
	constructor(
		private readonly findAnswersFromCompanyFromGroupingService: FindAnswersFromCompanyFromGroupingService,
	) {}

	@Get(':companyId/:groupingId')
	async read(
		@Param('companyId') companyId: string,
		@Param('groupingId') groupingId: string,
		@Res() res: Response,
	) {
		const answers =
			await this.findAnswersFromCompanyFromGroupingService.execute(
				companyId,
				groupingId,
			);
		res.json(answers).status(HttpStatus.OK);
	}
}
