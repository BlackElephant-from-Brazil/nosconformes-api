import {
	Body,
	Controller,
	HttpStatus,
	Param,
	Put,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateCompanyReqDTO } from '../dtos/req/update-company.req.dto';
import { UpdateManagerReqDTO } from '../dtos/req/update-manager.req.dto';
import { UpdateCompanyDataService } from '../services/update-company-data.service';
import { UpdateManagerDataService } from '../services/update-manager-data.service';

@UseGuards(JwtAuthGuard)
@Controller('companies')
export class UpdateCompanyController {
	constructor(
		private readonly updateCompanyDataService: UpdateCompanyDataService,
		private readonly updateManagerDataService: UpdateManagerDataService,
	) {}

	@Put('/company/:id')
	async updateCompanyData(
		@Body() { company }: UpdateCompanyReqDTO,
		@Param('id') companyId: string,
		@Res() res: Response,
	) {
		const updatedCompany = await this.updateCompanyDataService.execute(
			companyId,
			company,
		);

		res.json(updatedCompany).status(HttpStatus.OK);
	}

	@Put('/manager/:id')
	async updateManagerData(
		@Body() { manager }: UpdateManagerReqDTO,
		@Param('id') companyId: string,
		@Res() res: Response,
	) {
		const company = await this.updateManagerDataService.execute(
			companyId,
			manager,
		);

		res.json(company).status(HttpStatus.OK);
	}
}
