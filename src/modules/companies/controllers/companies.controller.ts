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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCompanyDTO } from '../dtos/create-company.dto';
import { CreateCompanyService } from '../services/create-company.service';
import { FindAllCompaniesService } from '../services/find-all-companies.service';
import { FindCompanyByIdService } from '../services/find-company-by-id.service';

@Controller('companies')
export class CompaniesController {
	constructor(
		private readonly createCompanyService: CreateCompanyService,
		private readonly findAllCompaniesService: FindAllCompaniesService,
		private readonly findCompanyByIdService: FindCompanyByIdService,
	) {}
	@UseGuards(JwtAuthGuard)
	@Get()
	async read(@Query('query') query: string, @Res() res: Response) {
		const companies = await this.findAllCompaniesService.execute(query);

		res.json(companies).status(HttpStatus.OK);
	}

	@UseGuards(JwtAuthGuard)
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

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async show(@Param('id') companyId: string, @Res() res: Response) {
		const foundCompany = await this.findCompanyByIdService.execute(
			companyId,
		);

		res.json(foundCompany).status(HttpStatus.OK);
	}
}
