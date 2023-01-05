import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCompanyDTO } from './dtos/create-company.dto';
import { CreateCompanyService } from './services/create-company.service';
import { FindCompaniesService } from './services/find-companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly createCompanyService: CreateCompanyService,
    private readonly findCompaniesService: FindCompaniesService,
  ) {}

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
  @Get()
  async read(@Query('query') query: string, @Res() res: Response) {
    const companies = await this.findCompaniesService.execute(query);

    res.json(companies).status(HttpStatus.OK);
  }
}
