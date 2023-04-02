import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Questionary } from '../questionaries/questionary.entity';
import { Question } from '../questions/question.entity';

@Entity('groupings')
export class Grouping {
	@PrimaryGeneratedColumn('uuid')
	_eq: string;

	@Column()
	name: string;

	@ManyToMany(() => Question, { cascade: true })
	@JoinTable({
		name: 'groupings_questions',
		joinColumn: { name: 'grouping_id' },
		inverseJoinColumn: { name: 'questions_id' },
	})
	questions: Question[];

	@ManyToMany(() => Questionary, { cascade: true })
	@JoinTable({
		name: 'questionaries_groupings',
		joinColumn: { name: 'grouping_id', referencedColumnName: '_eq' },
		inverseJoinColumn: {
			name: 'questionary_id',
			referencedColumnName: '_eq',
		},
	})
	questionaries: Questionary[];

	percentage?: number;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
