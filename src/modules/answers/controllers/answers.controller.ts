import {
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	Req,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FindAnswersFromCompanyFromGroupingService } from '../services/find-answers-from-company-from-grouping.service';
import { RegisterAnswerAccordingButtonService } from '../services/register-answer-according-button.service';
import { UserInfo } from 'src/interfaces/user-info.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@UseGuards(JwtAuthGuard)
@Controller('answers')
export class AnswersController {
	constructor(
		private readonly findAnswersFromCompanyFromGroupingService: FindAnswersFromCompanyFromGroupingService,
		private readonly registerAnswerAccordingButtonService: RegisterAnswerAccordingButtonService,
	) {}

	@Get(':companyId/:groupingId')
	async read(
		@Param('companyId') companyId: string,
		@Param('groupingId') groupingId: string,
		@Res() res: Response,
	) {
		const answers =
			await this.findAnswersFromCompanyFromGroupingService.execute(
				companyId,
				groupingId,
			);
		res.json(answers).status(HttpStatus.OK);
	}

	@Post(':questionId/according-button/:buttonId')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads',
				filename: (req, file, cb) => {
					const filename = `${Date.now()}-${file.originalname}`;
					cb(null, filename);
				},
			}),
		}),
	)
	async registerAnswerAccordingButton(
		@Req() req: Request,
		@Param('questionId') questionId: string,
		@Param('buttonId') buttonId: string,
		@UploadedFile() file: Express.Multer.File,
		@Res() res: Response,
	) {
		const { userId: employeeId } = req.user as UserInfo;
		await this.registerAnswerAccordingButtonService.execute(
			questionId,
			buttonId,
			employeeId,
			file.path,
		);
		res.status(HttpStatus.CREATED).send();
	}
}
