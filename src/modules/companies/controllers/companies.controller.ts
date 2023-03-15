import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Query,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCompanyDTO } from '../dtos/create-company.dto';
import { CreateCompanyService } from '../services/create-company.service';
import { DeleteCompanyLogoService } from '../services/delete-company-logo.service';
import { FindAllCompaniesService } from '../services/find-all-companies.service';
import { FindCompanyByIdService } from '../services/find-company-by-id.service';
import { UpdateCompanyLogoService } from '../services/update-company-logo.service';

@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
	constructor(
		private readonly createCompanyService: CreateCompanyService,
		private readonly findAllCompaniesService: FindAllCompaniesService,
		private readonly findCompanyByIdService: FindCompanyByIdService,
		private readonly deleteCompanyLogoService: DeleteCompanyLogoService,
		private readonly updateCompanyLogoService: UpdateCompanyLogoService,
	) {}

	@Get()
	async read(@Query('query') query: string, @Res() res: Response) {
		const companies = await this.findAllCompaniesService.execute(query);

		res.json(companies).status(HttpStatus.OK);
	}

	@Post()
	async create(
		@Body() createCompanyDTO: CreateCompanyDTO,
		@Res() res: Response,
	) {
		const createdCompany = await this.createCompanyService.execute(
			createCompanyDTO,
		);

		res.json(createdCompany).status(HttpStatus.CREATED);
	}

	@Get(':id')
	async show(@Param('id') companyId: string, @Res() res: Response) {
		const foundCompany = await this.findCompanyByIdService.execute(
			companyId,
		);

		res.json(foundCompany).status(HttpStatus.OK);
	}

	@Delete(':id/logo')
	async deleteLogo(@Param('id') companyId: string, @Res() res: Response) {
		await this.deleteCompanyLogoService.execute(companyId);

		res.status(HttpStatus.OK).send();
	}

	@Post(':id/logo')
	@UseInterceptors(
		FileInterceptor('logo', {
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
		@UploadedFile() logo: Express.Multer.File,
		@Res() res: Response,
	) {
		const uploadedLogoUrl = await this.updateCompanyLogoService.execute(
			companyId,
			logo.path,
		);

		res.json(uploadedLogoUrl).status(HttpStatus.OK);
	}
}
