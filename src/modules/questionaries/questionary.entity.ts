import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Company } from '../companies/companies.entity';
import { Grouping } from '../groupings/grouping.entity';
import { User } from '../users/users.entity';

@Entity('questionaries')
export class Questionary {
	@PrimaryGeneratedColumn('uuid')
	_eq: string;

	@Column()
	name: string;

	@ManyToMany(() => User, { cascade: true })
	@JoinTable({
		name: 'questionaries_auditors',
		joinColumn: { name: 'questionary_id' },
		inverseJoinColumn: { name: 'auditor_id' },
	})
	auditors: User[];

	@ManyToMany(() => Company, { cascade: true })
	@JoinTable({
		name: 'questionaries_companies',
		joinColumn: { name: 'questionary_id' },
		inverseJoinColumn: { name: 'company_id' },
	})
	companies: Company[];

	@ManyToMany(() => Grouping, { cascade: true })
	@JoinTable({
		name: 'questionaries_groupings',
		joinColumn: { name: 'questionary_id' },
		inverseJoinColumn: { name: 'grouping_id' },
	})
	groupings: Grouping[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
