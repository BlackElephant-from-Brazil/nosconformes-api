import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Query,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateQuestionDTO } from '../dtos/create-question.dto';
import { CreateQuestionService } from '../services/create-question.service';
import { FindQuestionByIdService } from '../services/find-question-by-id.service';
import { FindQuestionsService } from '../services/find-questions.service';
import { GenerateNewIdService } from '../services/generate-new-id.service';
import { UpdateEmployeesInQuestionsDTO } from '../dtos/update-employees-in-questions.dto';
import { UserInfo } from 'src/interfaces/user-info.type';
import { UpdateEmployeesInQuestionsService } from '../services/update-employees-in-questions.service';
import { DeleteEmployeesInQuestionsService } from '../services/delete-employees-in-questions.service';

@UseGuards(JwtAuthGuard)
@Controller('questions')
export class QuestionsController {
	constructor(
		private readonly createQuestionService: CreateQuestionService,
		private readonly findQuestionsService: FindQuestionsService,
		private readonly findQuestionByIdService: FindQuestionByIdService,
		private readonly generateNewIdService: GenerateNewIdService,
		private readonly updateEmployeesInQuestionsService: UpdateEmployeesInQuestionsService,
		private readonly deleteEmployeesInQuestionsService: DeleteEmployeesInQuestionsService,
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
	async find(
		@Query('query') query: string,
		@Query('page') page = 1,
		@Res() res: Response,
	) {
		const paginatedFindQuestions = await this.findQuestionsService.execute(
			page,
			query,
		);
		res.json(paginatedFindQuestions).status(HttpStatus.OK);
	}

	@Get('/new-id')
	async newId(@Res() res: Response) {
		const newId = await this.generateNewIdService.execute();
		res.json(newId).status(HttpStatus.OK);
	}

	@Get(':id')
	async show(@Param('id') questionId: string, @Res() res: Response) {
		const question = await this.findQuestionByIdService.execute(questionId);
		res.json(question).status(HttpStatus.OK);
	}

	@Post('/employees')
	async updateEmployeesInQuestions(
		@Req() req: Request,
		@Body() updateEmployeesInQuestionsDTO: UpdateEmployeesInQuestionsDTO,
		@Res() res: Response,
	) {
		const { userId: employeeId } = req.user as UserInfo;
		await this.updateEmployeesInQuestionsService.execute(
			employeeId,
			updateEmployeesInQuestionsDTO,
		);
		res.status(HttpStatus.OK).send();
	}

	@Delete('/employees/:deletedEmployeeId')
	async deleteEmployeesInQuestions(
		@Req() req: Request,
		@Param('deletedEmployeeId') deletedEmployeeId: string,
		@Query('questionIds') questionIds: string[],
		@Res() res: Response,
	) {
		const { userId: employeeId } = req.user as UserInfo;
		await this.deleteEmployeesInQuestionsService.execute(
			employeeId,
			deletedEmployeeId,
			questionIds,
		);
		res.status(HttpStatus.OK).send();
	}
}
