import {
	Controller,
	Get,
	HttpStatus,
	Param,
	Query,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { FindAllQuestionariesFromCompanyByIdService } from '../services/find-all-questionaries-from-company-by-id.service';

@UseGuards(JwtAuthGuard)
@Controller('questionaries')
export class QuestionariesCompanyController {
	constructor(
		private readonly findAllQuestionariesFromCompanyByIdService: FindAllQuestionariesFromCompanyByIdService,
	) {}

	@Get(':companyId/company')
	async findAll(
		@Param('companyId') companyId: string,
		@Query('query') query: string,
		@Res() res: Response,
	) {
		const questionaries =
			await this.findAllQuestionariesFromCompanyByIdService.execute(
				companyId,
				query,
			);
		res.json(questionaries).status(HttpStatus.OK);
	}
}
