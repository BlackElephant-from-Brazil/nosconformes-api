import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Company } from '../companies/companies.entity';

@Entity('employees')
export class Employee {
	@PrimaryGeneratedColumn('uuid')
	_eq: string;

	@Column()
	name: string;

	@Column()
	office: string;

	@Column()
	department: string;

	@Column({ name: 'access_level' })
	accessLevel: 'manager' | 'employee';

	@Column()
	email: string;

	@Column()
	phone: string;

	@Column()
	password?: string;

	@Column({ name: 'company_id' })
	companyId: string;

	@ManyToOne(() => Company, (company) => company.employees)
	@JoinColumn({ name: 'company_id' })
	company: Company;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
