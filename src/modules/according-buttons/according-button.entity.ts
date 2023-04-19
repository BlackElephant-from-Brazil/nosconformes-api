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
import { Question } from '../questions/question.entity';
import { AccordingButtonFile } from '../according-button-files/according-button-file.entity';

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

	@OneToMany(
		() => AccordingButtonFile,
		(accordingButtonFile) => accordingButtonFile.accordingButton,
		{ cascade: true },
	)
	accordingButtonFiles: AccordingButtonFile[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
