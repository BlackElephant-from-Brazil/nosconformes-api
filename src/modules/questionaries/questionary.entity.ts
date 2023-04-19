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
import { Company } from '../companies/companies.entity';
import { Grouping } from '../groupings/grouping.entity';
import { QuestionariesCompanies } from './questionaries-companies.entity';
import { Employee } from '../employees/employee.entity';

@Entity('questionaries')
export class Questionary {
	@PrimaryGeneratedColumn('uuid')
	_eq: string;

	@Column()
	name: string;

	@ManyToMany(() => Company, { cascade: true })
	@JoinTable({
		name: 'questionaries_companies',
		joinColumn: { name: 'questionary_id', referencedColumnName: '_eq' },
		inverseJoinColumn: { name: 'company_id', referencedColumnName: '_eq' },
	})
	companies: Company[];

	@ManyToMany(() => Grouping, { cascade: true })
	@JoinTable({
		name: 'questionaries_groupings',
		joinColumn: { name: 'questionary_id', referencedColumnName: '_eq' },
		inverseJoinColumn: { name: 'grouping_id', referencedColumnName: '_eq' },
	})
	groupings: Grouping[];

	@OneToMany(
		() => QuestionariesCompanies,
		(questionariesCompanies) => questionariesCompanies.questionary,
		{
			cascade: true,
		},
	)
	questionariesCompanies: QuestionariesCompanies[];

	@ManyToMany(() => Employee, { cascade: true })
	@JoinTable({
		name: 'questionaries_employees',
		joinColumn: { name: 'questionary_id', referencedColumnName: '_eq' },
		inverseJoinColumn: {
			name: 'employee_id',
			referencedColumnName: '_eq',
		},
	})
	employees: Employee[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
