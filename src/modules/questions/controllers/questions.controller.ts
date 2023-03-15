import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	Query,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateQuestionDTO } from '../dtos/create-question.dto';
import { CreateQuestionService } from '../services/create-question.service';
import { FindQuestionByIdService } from '../services/find-question-by-id.service';
import { FindQuestionsService } from '../services/find-questions.service';

@UseGuards(JwtAuthGuard)
@Controller('questions')
export class QuestionsController {
	constructor(
		private readonly createQuestionService: CreateQuestionService,
		private readonly findQuestionsService: FindQuestionsService,
		private readonly findQuestionByIdService: FindQuestionByIdService,
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

	@Get(':id')
	async show(@Param('id') questionId: string, @Res() res: Response) {
		console.log(questionId);
		const question = await this.findQuestionByIdService.execute(questionId);
		res.json(question).status(HttpStatus.OK);
	}
}
