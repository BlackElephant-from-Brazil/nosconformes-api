import {
	Body,
	Controller,
	HttpStatus,
	Post,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCompanyDTO } from '../dtos/create-company.dto';
import { CreateCompanyService } from '../services/create-company.service';

@Controller('companies')
export class CompaniesController {
	constructor(private readonly createCompanyService: CreateCompanyService) {}

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
}
