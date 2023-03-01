import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('questions')
export class Question {
	@PrimaryGeneratedColumn('uuid')
	_eq: string;

	@Column()
	id: string;

	@Column()
	question: string;

	@Column({ type: 'text', array: true })
	funcs: string[];

	@Column()
	threat: string;

	@Column()
	recommendation: string;

	@Column()
	description: string;

	@Column({ type: 'text', array: true })
	accordingButtons: string[];

	@Column({ type: 'text', array: true })
	partialAccordingButtons: string[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
