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
import { QuestionariesCompanies } from '../questionaries/questionaries-companies.entity';
import { Questionary } from '../questionaries/questionary.entity';

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

	@OneToMany(
		() => QuestionariesCompanies,
		(questionariesCompanies) => questionariesCompanies.company,
		{
			cascade: true,
		},
	)
	questionariesCompanies: QuestionariesCompanies[];

	@ManyToMany(() => Questionary)
	@JoinTable({
		name: 'questionaries_companies',
		joinColumn: { name: 'company_id', referencedColumnName: '_eq' },
		inverseJoinColumn: {
			name: 'questionary_id',
			referencedColumnName: '_eq',
		},
	})
	questionaries: Questionary[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
