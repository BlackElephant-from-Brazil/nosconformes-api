import { Controller, Get } from '@nestjs/common';
import { CompaniesEntity } from './companies.entity';
import { CompaniesService } from './company.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companyService: CompaniesService) {}

  @Get()
  getHello(): string {
    return this.companyService.getHello();
  }

  @Get('/teste')
  show(): Promise<CompaniesEntity | undefined> {
    return this.companyService.findOneById(
      '9545103c-433b-4ae0-bdf4-ca72bd08e8a6',
    );
  }
}
