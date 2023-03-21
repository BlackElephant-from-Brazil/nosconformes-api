import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Question } from '../questions/question.entity';

@Entity('according_buttons')
export class AccordingButton {
	@PrimaryGeneratedColumn('uuid')
	_eq: string;

	@Column()
	label: string;

	@Column({ name: 'question_id' })
	questionId: string;

	@ManyToOne(() => Question, (question) => question.accordingButtons)
	@JoinColumn({ name: 'question_id' })
	question: Question;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
