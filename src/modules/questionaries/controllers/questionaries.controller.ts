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
	Res,
} from '@nestjs/common';
import { Response } from 'express';
import { EditQuestionaryDTO } from '../dtos/edit-questionary.dto';
import { AddGroupingToQuestionaryService } from '../services/add-grouping-to-questionary.service';
import { CreateQuestionaryService } from '../services/create-questionary.service';
import { DeleteGroupingFromQuestionaryService } from '../services/delete-grouping-from-questionary.service';
import { EditQuestionaryService } from '../services/edit-questionary.service';
import { FindAvailableAuditorsForQuestionaryService } from '../services/find-available-auditors-for-questionary.service';
import { FindAvailableCompaniesFromQuestionaryService } from '../services/find-available-companies-from-questionary.service';
import { FindAvailableGroupingsFromQuestionaryService } from '../services/find-available-groupings-from-questionary.service';
import { FindQuestionariesService } from '../services/find-questionaries.service';
import { FindQuestionaryByIdService } from '../services/find-questionary-by-id.service';

@Controller('questionaries')
export class QuestionariesController {
	constructor(
		private readonly findQuestionariesService: FindQuestionariesService,
		private readonly createQuestionaryService: CreateQuestionaryService,
		private readonly editQuestionaryService: EditQuestionaryService,
		private readonly findQuestionaryByIdService: FindQuestionaryByIdService,
		private readonly findAvailableAuditorsForQuestionaryService: FindAvailableAuditorsForQuestionaryService,
		private readonly findAvailableGroupingsFromQuestionaryService: FindAvailableGroupingsFromQuestionaryService,
		private readonly findAvailableCompaniesFromQuestionaryService: FindAvailableCompaniesFromQuestionaryService,
		private readonly deleteGroupingFromQuestionaryService: DeleteGroupingFromQuestionaryService,
		private readonly addGroupingToQuestionaryService: AddGroupingToQuestionaryService,
	) {}

	@Post()
	async create(@Res() res: Response) {
		const questionaryId = await this.createQuestionaryService.execute();
		res.json({ questionaryId }).status(HttpStatus.CREATED);
	}

	@Put(':id')
	async edit(
		@Body() editQuestionaryDTO: EditQuestionaryDTO,
		@Param('id') questionaryId: string,
		@Res() res: Response,
	) {
		const questionary = await this.editQuestionaryService.execute({
			name: editQuestionaryDTO.name,
			questionaryId,
		});
		res.json({ questionary }).status(HttpStatus.OK);
	}

	@Get()
	async find(@Query('query') query: string, @Res() res: Response) {
		const questionaries = await this.findQuestionariesService.execute(
			query,
		);
		res.json(questionaries).status(HttpStatus.OK);
	}

	@Get(':id')
	async show(@Param('id') questionaryId: string, @Res() res: Response) {
		const questionary = await this.findQuestionaryByIdService.execute(
			questionaryId,
		);
		res.json(questionary).status(HttpStatus.OK);
	}

	@Get('/available-auditors/:id')
	async findAvailableAuditors(
		@Param('id') questionaryId: string,
		@Res() res: Response,
	) {
		const availableAuditors =
			await this.findAvailableAuditorsForQuestionaryService.execute(
				questionaryId,
			);
		res.json(availableAuditors).status(HttpStatus.OK);
	}

	@Get('/available-companies/:id')
	async findAvailableCompanies(
		@Param('id') questionaryId: string,
		@Res() res: Response,
	) {
		const availableCompanies =
			await this.findAvailableCompaniesFromQuestionaryService.execute(
				questionaryId,
			);
		res.json(availableCompanies).status(HttpStatus.OK);
	}

	@Get('/available-groupings/:id')
	async findAvailableGroupings(
		@Param('id') questionaryId: string,
		@Res() res: Response,
	) {
		const availableGroupings =
			await this.findAvailableGroupingsFromQuestionaryService.execute(
				questionaryId,
			);
		res.json(availableGroupings).status(HttpStatus.OK);
	}

	@Delete(':questionaryId/groupings/:groupingId')
	async deleteGrouping(
		@Param('questionaryId') questionaryId: string,
		@Param('groupingId') groupingId: string,
		@Res() res: Response,
	) {
		await this.deleteGroupingFromQuestionaryService.execute({
			groupingId,
			questionaryId,
		});
		res.status(HttpStatus.OK).send();
	}

	@Put(':questionaryId/groupings/:groupingId')
	async addGrouping(
		@Param('questionaryId') questionaryId: string,
		@Param('groupingId') groupingId: string,
		@Res() res: Response,
	) {
		await this.addGroupingToQuestionaryService.execute({
			groupingId,
			questionaryId,
		});
		res.status(HttpStatus.OK).send();
	}
}
