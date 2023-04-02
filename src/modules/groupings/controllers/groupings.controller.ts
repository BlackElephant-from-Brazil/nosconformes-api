import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Put,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AddQuestionsToGroupingDTO } from '../dtos/add-questions-to-grouping.dto';
import { CreateGroupingDTO } from '../dtos/create-grouping.dto';
import { EditGroupingDTO } from '../dtos/edit-grouping.dto';
import { RemoveQuestionsFromGroupingDTO } from '../dtos/remove-questions-to-grouping.dto';
import { AddQuestionsToGroupingService } from '../services/add-questions-to-grouping.service';
import { CreateGroupingService } from '../services/create-grouping.service';
import { UpdatingGroupingNameService } from '../services/updating-grouping-name.service';
import { FindAllGroupingsService } from '../services/find-all-groupings.service';
import { FindGroupingByIdService } from '../services/find-grouping-by-id.service';
import { RemoveQuestionsFromGroupingService } from '../services/remove-questions-from-grouping.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('groupings')
export class GroupingController {
	constructor(
		private readonly createGroupingService: CreateGroupingService,
		private readonly updatingGroupingNameService: UpdatingGroupingNameService,
		private readonly findGroupingByIdService: FindGroupingByIdService,
		private readonly addQuestionsToGroupingService: AddQuestionsToGroupingService,
		private readonly findAllGroupingsService: FindAllGroupingsService,
		private readonly removeQuestionsFromGroupingService: RemoveQuestionsFromGroupingService,
	) {}

	@Post()
	async create(
		@Body() createGroupingDTO: CreateGroupingDTO,
		@Res() res: Response,
	) {
		const grouping = await this.createGroupingService.execute(
			createGroupingDTO,
		);
		res.json(grouping).status(HttpStatus.CREATED);
	}

	@Put(':id')
	async update(
		@Param('id') groupingId: string,
		@Body() editGroupingDTO: EditGroupingDTO,
		@Res() res: Response,
	) {
		await this.updatingGroupingNameService.execute({
			...editGroupingDTO,
			groupingId,
		});
		res.status(HttpStatus.OK).send();
	}

	@Get(':id')
	async find(@Param('id') groupingId: string, @Res() res: Response) {
		const grouping = await this.findGroupingByIdService.execute(groupingId);
		res.json(grouping).status(HttpStatus.OK);
	}

	@Get('')
	async findAll(@Res() res: Response) {
		const groupings = await this.findAllGroupingsService.execute();
		res.json(groupings).status(HttpStatus.OK);
	}

	@Put('add-questions/:id')
	async addQuestionsToGrouping(
		@Param('id') groupingId: string,
		@Body() addQuestionsToGroupingDTO: AddQuestionsToGroupingDTO,
		@Res() res: Response,
	) {
		await this.addQuestionsToGroupingService.execute({
			...addQuestionsToGroupingDTO,
			groupingId,
		});
		res.status(HttpStatus.OK).send();
	}

	@Delete('remove-questions/:id')
	async removeQuestionsFromGrouping(
		@Param('id') groupingId: string,
		@Body() removeQuestionsFromGroupingDTO: RemoveQuestionsFromGroupingDTO,
		@Res() res: Response,
	) {
		await this.removeQuestionsFromGroupingService.execute({
			...removeQuestionsFromGroupingDTO,
			groupingId,
		});
		res.status(HttpStatus.OK).send();
	}
}
