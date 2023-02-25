import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
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

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
