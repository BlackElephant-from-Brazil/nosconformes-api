import {
	Column,
	Entity,
	JoinColumn,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../companies/companies.entity';
import { Questionary } from './questionary.entity';

// TODO: UNDERSTAND WHY THIS MAY USE QUESTIONARY_ID AND COMPANY_ID UNLESS QUESTIONARYID AND COMPANYID
@Entity('questionaries_companies')
export class QuestionariesCompanies {
	@PrimaryGeneratedColumn('uuid')
	_eq: string;

	@Column({ name: 'questionary_id' })
	questionary_id: string;

	@Column({ name: 'company_id' })
	company_id: string;

	@ManyToOne(
		() => Questionary,
		(questionary) => questionary.questionariesCompanies,
	)
	@JoinColumn({ name: 'questionary_id', referencedColumnName: '_eq' })
	public questionary: Questionary;

	@ManyToOne(() => Company, (company) => company.questionariesCompanies)
	@JoinColumn({ name: 'company_id', referencedColumnName: '_eq' })
	public company: Company;
}
