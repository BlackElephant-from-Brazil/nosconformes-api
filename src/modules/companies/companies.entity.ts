import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Employee } from '../employees/employee.entity';
import { User } from '../users/users.entity';

@Entity('companies')
export class Company {
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

	@OneToMany(() => Employee, (employee) => employee.company)
	employees: Employee[];

	@ManyToMany(() => User)
	@JoinTable({
		name: 'companies_auditors',
		joinColumn: { name: 'company_id' },
		inverseJoinColumn: { name: 'auditor_id' },
	})
	auditors: User[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
