import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	Put,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RegisterMessageDTO } from '../dtos/register-message.dto';
import { FindMessagesFromQuestionFromCompanyService } from '../services/find-messages-from-question-from-company.service';
import { HasUnreadMessagesFromQuestionFromCompanyForAuditorService } from '../services/has-unread-messages-from-question-from-company-for-auditor.service';
import { HasUnreadMessagesFromQuestionFromCompanyForEmployeeService } from '../services/has-unread-messages-from-question-from-company-for-employee.service';
import { RegisterMessageService } from '../services/register-message.service';
import { UpdateMessageAsReadForAuditorService } from '../services/update-message-as-read-for-auditor.service';
import { UpdateMessageAsReadForEmployeeService } from '../services/update-message-as-read-for-employee.service';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
	constructor(
		private readonly registerMessageService: RegisterMessageService,
		private readonly findMessagesFromQuestionFromCompanyService: FindMessagesFromQuestionFromCompanyService,
		private readonly hasUnreadMessagesFromQuestionFromCompanyForAuditorService: HasUnreadMessagesFromQuestionFromCompanyForAuditorService,
		private readonly hasUnreadMessagesFromQuestionFromCompanyForEmployeeService: HasUnreadMessagesFromQuestionFromCompanyForEmployeeService,
		private readonly updateMessageAsReadForAuditorService: UpdateMessageAsReadForAuditorService,
		private readonly updateMessageAsReadForEmployeeService: UpdateMessageAsReadForEmployeeService,
	) {}

	@Post()
	async create(
		@Body() registerMessageDTO: RegisterMessageDTO,
		@Res() res: Response,
	) {
		await this.registerMessageService.execute(registerMessageDTO);
		res.status(HttpStatus.CREATED).send();
	}

	@Get(':questionId/:companyId')
	async read(
		@Param('questionId') questionId: string,
		@Param('companyId') companyId: string,
		@Res() res: Response,
	) {
		const messages =
			await this.findMessagesFromQuestionFromCompanyService.execute(
				questionId,
				companyId,
			);
		res.json(messages).status(HttpStatus.OK);
	}

	@Get(':questionId/:companyId/unread-for-auditor')
	async hasUnreadMessagesForAuditor(
		@Param('questionId') questionId: string,
		@Param('companyId') companyId: string,
		@Res() res: Response,
	) {
		const hasUnreadMessages =
			await this.hasUnreadMessagesFromQuestionFromCompanyForAuditorService.execute(
				questionId,
				companyId,
			);
		res.json(hasUnreadMessages).status(HttpStatus.OK);
	}

	@Get(':questionId/:companyId/unread-for-auditor')
	async hasUnreadMessagesForEmployee(
		@Param('questionId') questionId: string,
		@Param('companyId') companyId: string,
		@Res() res: Response,
	) {
		const hasUnreadMessages =
			await this.hasUnreadMessagesFromQuestionFromCompanyForEmployeeService.execute(
				questionId,
				companyId,
			);
		res.json(hasUnreadMessages).status(HttpStatus.OK);
	}

	@Put(':questionId/:companyId/set-message-as-read-for-auditor')
	async setMessageAsReadForAuditor(
		@Param('questionId') questionId: string,
		@Param('companyId') companyId: string,
		@Res() res: Response,
	) {
		await this.updateMessageAsReadForAuditorService.execute(
			questionId,
			companyId,
		);
		res.status(HttpStatus.OK).send();
	}

	@Put(':questionId/:companyId/set-message-as-read-for-employee')
	async setMessageAsReadForEmployee(
		@Param('questionId') questionId: string,
		@Param('companyId') companyId: string,
		@Res() res: Response,
	) {
		await this.updateMessageAsReadForEmployeeService.execute(
			questionId,
			companyId,
		);
		res.status(HttpStatus.OK).send();
	}
}
