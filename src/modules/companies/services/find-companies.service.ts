import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Company } from '../companies.entity';

@Injectable()
export class FindCompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async execute(query?: string): Promise<Company[]> {
    const resolvedQuery = query ? `%${query}%` : '%%';
    const findCompanies = await this.companiesRepository.find({
      where: [
        {
          name: ILike(resolvedQuery),
        },
      ],
    });

    return findCompanies;
  }
}
