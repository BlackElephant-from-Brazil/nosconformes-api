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
import { UpdateAuditorsReqDTO } from '../dtos/req/update-auditors.req.dto';
import { UpdateCompanyReqDTO } from '../dtos/req/update-company.req.dto';
import { UpdateManagerReqDTO } from '../dtos/req/update-manager.req.dto';
import { UpdateAuditorsFromCompanyService } from '../services/update-auditors-from-company.service';
import { UpdateCompanyDataService } from '../services/update-company-data.service';
import { UpdateManagerDataService } from '../services/update-manager-data.service';

@Controller('companies')
export class UpdateCompanyController {
	constructor(
		private readonly updateCompanyDataService: UpdateCompanyDataService,
		private readonly updateManagerDataService: UpdateManagerDataService,
		private readonly updateAuditorsFromCompanyService: UpdateAuditorsFromCompanyService,
	) {}
	@UseGuards(JwtAuthGuard)
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

	@UseGuards(JwtAuthGuard)
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

	@UseGuards(JwtAuthGuard)
	@Put('/auditors/:id')
	async updateAuditors(
		@Body() { auditors }: UpdateAuditorsReqDTO,
		@Param('id') companyId: string,
		@Res() res: Response,
	) {
		const company = await this.updateAuditorsFromCompanyService.execute(
			companyId,
			auditors,
		);

		res.json(company).status(HttpStatus.OK);
	}
}
