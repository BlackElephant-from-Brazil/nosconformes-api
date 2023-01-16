import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies.entity';
import { CreateCompanyDTO } from '../dtos/create-company.dto';

@Injectable()
export class CreateCompanyService {
	constructor(
		@InjectRepository(Company)
		private companiesRepository: Repository<Company>,
	) {}

	async execute({
		logo,
		name,
		site,
		cnpj,
	}: CreateCompanyDTO): Promise<Company> {
		let company: Company;
		try {
			company = this.companiesRepository.create({
				logo,
				name,
				site,
				cnpj,
			});
		} catch (e) {
			throw new InternalServerErrorException();
		}

		try {
			await this.companiesRepository.save(company);
		} catch (e) {
			throw new InternalServerErrorException();
		}

		return company;
	}
}
