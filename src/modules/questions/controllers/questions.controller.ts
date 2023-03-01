import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Post,
	Query,
	Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateQuestionDTO } from '../dtos/create-question.dto';
import { CreateQuestionService } from '../services/create-question.service';
import { FindQuestionsService } from '../services/find-questions.service';

@Controller('questions')
export class QuestionsController {
	constructor(
		private readonly createQuestionService: CreateQuestionService,
		private readonly findQuestionsService: FindQuestionsService,
	) {}

	@Post()
	async create(
		@Body() createQuestionDTO: CreateQuestionDTO,
		@Res() res: Response,
	) {
		const createdQuestion = await this.createQuestionService.execute(
			createQuestionDTO,
		);
		res.json(createdQuestion).status(HttpStatus.CREATED);
	}

	@Get()
	async find(@Query('query') query: string, @Res() res: Response) {
		const questions = await this.findQuestionsService.execute(query);
		res.json(questions).status(HttpStatus.OK);
	}
}
