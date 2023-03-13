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
import { UpdateCompaniesFromQuestionaryDTO } from '../dtos/update-companies-from-questionary.dto';
import { UpdateCompaniesFromQuestionaryService } from '../services/update-companies-from-questionary.service';

@Controller('questionaries')
export class UpdateQuestionaryController {
	constructor(
		private readonly updateCompaniesFromQuestionaryService: UpdateCompaniesFromQuestionaryService,
	) {}

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
