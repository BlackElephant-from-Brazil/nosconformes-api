import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateGroupingDTO } from './dtos/create-grouping.dto';
import { CreateGroupingService } from './services/create-grouping.service';

@Controller('groupings')
export class GroupingController {
	constructor(
		private readonly createGroupingService: CreateGroupingService,
	) {}

	@Post()
	async create(
		@Body() createGroupingDTO: CreateGroupingDTO,
		@Res() res: Response,
	) {
		const groupingId = await this.createGroupingService.execute(
			createGroupingDTO,
		);
		res.json({ groupingId }).status(HttpStatus.CREATED);
	}

	// @Put(':id')
	// async edit(
	// 	@Body() editQuestionaryDTO: EditQuestionaryDTO,
	// 	@Param('id') questionaryId: string,
	// 	@Res() res: Response,
	// ) {
	// 	const questionary = await this.editQuestionaryService.execute({
	// 		name: editQuestionaryDTO.name,
	// 		questionaryId,
	// 	});
	// 	res.json({ questionary }).status(HttpStatus.OK);
	// }

	// @Get()
	// async find(@Query('query') query: string, @Res() res: Response) {
	// 	const questionaries = await this.findQuestionariesService.execute(
	// 		query,
	// 	);
	// 	res.json(questionaries).status(HttpStatus.OK);
	// }
}
