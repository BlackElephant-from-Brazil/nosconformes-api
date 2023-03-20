import {
	Controller,
	Get,
	HttpStatus,
	Query,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('answers')
export class AnswersController {
	// constructor() {
	// 	private readonly findAnswersBy: CreateCompanyService,
	// }
	// @Get()
	// async read(@Query('query') query: string, @Res() res: Response) {
	// 	const companies = await this.findAllCompaniesService.execute(query);
	// 	res.json(companies).status(HttpStatus.OK);
	// }
}
