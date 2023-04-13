import {
	Body,
	Controller,
	Delete,
	HttpStatus,
	Param,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserInfo } from 'src/interfaces/user-info.type';
import { UpdateEmployeesInQuestionariesService } from '../services/update-employees-in-questionaries.service';
import { UpdateEmployeeInQuestionaryDTO } from '../dtos/update-employee-in-questionary.dto';
import { RemoveEmployeeFromQuestionaryService } from '../services/remove-employee-from-questionary.service';

@UseGuards(JwtAuthGuard)
@Controller('questionaries')
export class QuestionariesEmployeesController {
	constructor(
		private readonly updateEmployeesInQuestionariesService: UpdateEmployeesInQuestionariesService,
		private readonly removeEmployeeFromQuestionaryService: RemoveEmployeeFromQuestionaryService,
	) {}

	@Post(':questionaryId/employees')
	async updateEmployeesInQuestionaries(
		@Req() req: Request,
		@Param('questionaryId') questionaryId: string,
		@Res() res: Response,
		@Body() updateEmployeeInQuestionaryDTO: UpdateEmployeeInQuestionaryDTO,
	) {
		const { userId: employeeId } = req.user as UserInfo;
		await this.updateEmployeesInQuestionariesService.execute(
			employeeId,
			questionaryId,
			updateEmployeeInQuestionaryDTO.employees,
		);
		res.status(HttpStatus.OK).send();
	}

	@Delete(':questionaryId/employees/:deletedEmployeeId')
	async removeEmployeeFromQuestionary(
		@Req() req: Request,
		@Param('questionaryId') questionaryId: string,
		@Param('deletedEmployeeId') deletedEmployeeId: string,
		@Res() res: Response,
	) {
		const { userId: employeeId } = req.user as UserInfo;
		await this.removeEmployeeFromQuestionaryService.execute(
			employeeId,
			questionaryId,
			deletedEmployeeId,
		);
		res.status(HttpStatus.OK).send();
	}
}
