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
	Req,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { FindEmployeeByIdService } from '../services/find-employee-by-id.service';
import { FindEmployeesService } from '../services/find-employees.service';
import { UserInfo } from 'src/interfaces/user-info.type';
import { CreateEmployeeDTO } from '../dtos/create-employee.dto';
import { CreateEmployeeService } from '../services/create-employee.service';
import { UpdateEmployeeDTO } from '../dtos/update-employee.dto';
import { UpdateEmployeeService } from '../services/update-employee.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DeleteEmployeePhotoService } from '../services/delete-employee-photo.service';
import { UpdateEmployeePhotoService } from '../services/update-employee-photo.service';
import { FindAvailableEmployeesToQuestionaryServcice } from '../services/find-available-employees-to-questionary.servcice';
import { FindEmployeesInQuestionaryService } from '../services/find-employees-in-questionary.service';

@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
	constructor(
		private readonly findEmployeeByIdService: FindEmployeeByIdService,
		private readonly findEmployeesService: FindEmployeesService,
		private readonly createEmployeeService: CreateEmployeeService,
		private readonly updateEmployeeService: UpdateEmployeeService,
		private readonly deleteEmployeePhotoService: DeleteEmployeePhotoService,
		private readonly updateEmployeePhotoService: UpdateEmployeePhotoService,
		private readonly findAvailableEmployeesToQuestionaryServcice: FindAvailableEmployeesToQuestionaryServcice,
		private readonly findEmployeesInQuestionaryService: FindEmployeesInQuestionaryService,
	) {}

	@Post()
	async create(
		@Req() req: Request,
		@Body() createEmployeeDTO: CreateEmployeeDTO,
		@Res() res: Response,
	) {
		const { userId: employeeId } = req.user as UserInfo;
		const createdEmployee = await this.createEmployeeService.execute(
			createEmployeeDTO,
			employeeId,
		);
		res.json(createdEmployee).status(HttpStatus.CREATED);
	}

	@Get('')
	async read(
		@Req() req: Request,
		@Query('query') query: string,
		@Res() res: Response,
	) {
		const { userId: employeeId } = req.user as UserInfo;
		const employees = await this.findEmployeesService.execute(
			query,
			employeeId,
		);
		res.json(employees).status(HttpStatus.OK);
	}

	@Put(':id')
	async update(
		@Body() updateEmployeeDTO: UpdateEmployeeDTO,
		@Param('id') employeeId: string,
		@Res() res: Response,
	) {
		await this.updateEmployeeService.execute(updateEmployeeDTO, employeeId);
		res.status(HttpStatus.OK).send();
	}

	@Get(':id')
	async show(@Param('id') employeeId: string, @Res() res: Response) {
		const users = await this.findEmployeeByIdService.execute(employeeId);
		res.json(users).status(HttpStatus.OK);
	}

	@Delete(':id/photo')
	async deletePhoto(@Param('id') userId: string, @Res() res: Response) {
		await this.deleteEmployeePhotoService.execute(userId);

		res.status(HttpStatus.OK).send();
	}

	@Post(':id/photo')
	@UseInterceptors(
		FileInterceptor('photo', {
			storage: diskStorage({
				destination: './uploads',
				filename: (req, file, cb) => {
					const filename = `${Date.now()}-${file.originalname}`;
					cb(null, filename);
				},
			}),
		}),
	)
	async uploadLogo(
		@Param('id') companyId: string,
		@UploadedFile() photo: Express.Multer.File,
		@Res() res: Response,
	) {
		const uploadedPhotoUrl = await this.updateEmployeePhotoService.execute(
			companyId,
			photo.path,
		);

		res.json(uploadedPhotoUrl).status(HttpStatus.OK);
	}

	@Get('available-to-questionary/:questinaryId')
	async findAvailableEmployeesToQuestionary(
		@Req() req: Request,
		@Param('questinaryId') questinaryId: string,
		@Res() res: Response,
	) {
		const { userId: employeeId } = req.user as UserInfo;
		const employees =
			await this.findAvailableEmployeesToQuestionaryServcice.execute(
				employeeId,
				questinaryId,
			);
		res.json(employees).status(HttpStatus.OK);
	}

	@Get('current-in-questionary/:questinaryId')
	async findEmployeesInQuestionary(
		@Req() req: Request,
		@Param('questinaryId') questinaryId: string,
		@Res() res: Response,
	) {
		const { userId: employeeId } = req.user as UserInfo;
		const employees = await this.findEmployeesInQuestionaryService.execute(
			employeeId,
			questinaryId,
		);
		res.json(employees).status(HttpStatus.OK);
	}
}
