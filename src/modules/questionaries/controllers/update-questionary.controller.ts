import {
	Body,
	Controller,
	HttpStatus,
	Param,
	Put,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateAuditorsFromQuestionaryDTO } from '../dtos/update-auditors-from-questionary.dto';
import { UpdateAuditorFromQuestionaryService } from '../services/update-auditor-from-questionary.service';

@Controller('questionaries')
export class UpdateQuestionaryController {
	constructor(
		// private readonly updateCompanyDataService: UpdateCompanyDataService,
		// private readonly updateManagerDataService: UpdateManagerDataService,
		private readonly updateAuditorFromQuestionaryService: UpdateAuditorFromQuestionaryService,
	) {}
	// @UseGuards(JwtAuthGuard)
	// @Put('/company/:id')
	// async updateCompanyData(
	// 	@Body() { company }: UpdateCompanyReqDTO,
	// 	@Param('id') companyId: string,
	// 	@Res() res: Response,
	// ) {
	// 	const updatedCompany = await this.updateCompanyDataService.execute(
	// 		companyId,
	// 		company,
	// 	);

	// 	res.json(updatedCompany).status(HttpStatus.OK);
	// }

	// @UseGuards(JwtAuthGuard)
	// @Put('/manager/:id')
	// async updateManagerData(
	// 	@Body() { manager }: UpdateManagerReqDTO,
	// 	@Param('id') companyId: string,
	// 	@Res() res: Response,
	// ) {
	// 	const company = await this.updateManagerDataService.execute(
	// 		companyId,
	// 		manager,
	// 	);

	// 	res.json(company).status(HttpStatus.OK);
	// }

	@UseGuards(JwtAuthGuard)
	@Put('/auditors/:id')
	async updateAuditors(
		@Body() { auditors }: UpdateAuditorsFromQuestionaryDTO,
		@Param('id') questionaryId: string,
		@Res() res: Response,
	) {
		const updatedQuestionary =
			await this.updateAuditorFromQuestionaryService.execute({
				questionaryId,
				auditors,
			});

		res.json(updatedQuestionary).status(HttpStatus.OK);
	}
}
