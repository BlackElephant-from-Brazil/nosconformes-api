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
import { UpdateCompaniesFromQuestionaryDTO } from '../dtos/update-companies-from-questionary.dto';
import { UpdateAuditorFromQuestionaryService } from '../services/update-auditor-from-questionary.service';
import { UpdateCompaniesFromQuestionaryService } from '../services/update-companies-from-questionary.service';

@Controller('questionaries')
export class UpdateQuestionaryController {
	constructor(
		private readonly updateAuditorFromQuestionaryService: UpdateAuditorFromQuestionaryService,
		private readonly updateCompaniesFromQuestionaryService: UpdateCompaniesFromQuestionaryService,
	) {}

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

	@UseGuards(JwtAuthGuard)
	@Put('/companies/:id')
	async updateCompanies(
		@Body() { companies }: UpdateCompaniesFromQuestionaryDTO,
		@Param('id') questionaryId: string,
		@Res() res: Response,
	) {
		const updatedQuestionary =
			await this.updateCompaniesFromQuestionaryService.execute({
				questionaryId,
				companies,
			});

		res.json(updatedQuestionary).status(HttpStatus.OK);
	}
}
