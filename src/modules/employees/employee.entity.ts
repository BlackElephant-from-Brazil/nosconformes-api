import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Company } from '../companies/companies.entity';
import { Message } from '../messages/message.entity';

@Entity('employees')
export class Employee {
	@PrimaryGeneratedColumn('uuid')
	_eq: string;

	@Column()
	name: string;

	@Column({ name: 'profile_picture' })
	profilePicture: string;

	@Column()
	office: string;

	@Column()
	department: string;

	@Column({ name: 'access_level' })
	accessLevel: 'patrocinador' | 'stackholder';

	@Column()
	email: string;

	@Column()
	phone: string;

	@Column()
	password?: string;

	@Column({ name: 'company_id' })
	companyId: string;

	@OneToMany(() => Message, (message) => message.employee)
	messages: Message[];

	@ManyToOne(() => Company, (company) => company.employees)
	@JoinColumn({ name: 'company_id' })
	company: Company;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
