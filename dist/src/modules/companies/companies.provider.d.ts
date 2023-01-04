import { DataSource } from 'typeorm';
import { CompaniesEntity } from './companies.entity';
export declare const companyProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<CompaniesEntity>;
    inject: string[];
}[];
