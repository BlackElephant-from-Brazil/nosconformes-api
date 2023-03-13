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
import { Protocol } from '../protocol/protocol.entity';
import { QuestionariesCompanies } from '../questionaries/questionaries-companies.entity';
// import { QuestionariesCompanies } from '../questionaries/questionaries-companies.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	_eq: string;

	@Column({ name: 'profile_picture' })
	profilePicture: string;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column()
	phone: string;

	@Column()
	office: string;

	@Column({ name: 'access_level' })
	accessLevel: 'master' | 'manager' | 'auditor' | 'consultor';

	@OneToMany(() => Protocol, (protocol) => protocol.user)
	protocols: Protocol[];

	@ManyToMany(() => QuestionariesCompanies, { cascade: true })
	@JoinTable({
		name: 'questionaries_companies_auditors',
		joinColumn: { name: 'auditor_id' },
		inverseJoinColumn: { name: 'questionary_company_id' },
	})
	questionariesCompanies: QuestionariesCompanies[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
