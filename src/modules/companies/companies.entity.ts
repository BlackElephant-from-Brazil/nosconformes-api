// import { Company } from 'src/graphql.schema';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('companies')
export class CompaniesEntity {
  @PrimaryGeneratedColumn('uuid')
  _eq: string;

  @Column()
  logo: string;

  @Column()
  name: string;

  @Column()
  cnpj: string;

  @Column()
  site: string;

  // @CreateDateColumn('created_at')
  // createdAt: Date;

  // @UpdateDateColumn('updated_at')
  // updatedAt: Date;
}
