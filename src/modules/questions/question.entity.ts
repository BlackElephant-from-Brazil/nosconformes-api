import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { AccordingButton } from '../according-buttons/according-button.entity';
import { Answer } from '../answers/answer.entity';
import { Grouping } from '../groupings/grouping.entity';
import { PartialAccordingButton } from '../partial-according-buttons/partial-according-button.entity';
import { Reference } from '../references/reference.entity';
import { Tag } from '../tags/tag.entity';

@Entity('questions')
export class Question {
	@PrimaryGeneratedColumn('uuid')
	_eq: string;

	@Column()
	id: string;

	@Column()
	question: string;

	@Column()
	func: string;

	@Column()
	threat: string;

	@Column()
	recommendation: string;

	@Column()
	description: string;

	@Column({ type: 'smallint' })
	priority: number;

	@Column({ type: 'smallint' })
	probability: number;

	@Column({ type: 'smallint' })
	impact: number;

	@Column({ name: 'partial_according_allow_information' })
	partialAccordingAllowInformation: boolean;

	@Column({ name: 'non_according_allow_information' })
	nonAccordingAllowInformation: boolean;

	@ManyToMany(() => Reference, { cascade: true })
	@JoinTable({
		name: 'questions_references',
		joinColumn: { name: 'question_id', referencedColumnName: '_eq' },
		inverseJoinColumn: {
			name: 'reference_id',
			referencedColumnName: '_eq',
		},
	})
	references: Reference[];

	@ManyToMany(() => Tag, { cascade: true })
	@JoinTable({
		name: 'questions_tags',
		joinColumn: { name: 'question_id', referencedColumnName: '_eq' },
		inverseJoinColumn: {
			name: 'tag_id',
			referencedColumnName: '_eq',
		},
	})
	tags: Tag[];

	@OneToMany(
		() => PartialAccordingButton,
		(partialAccordingButton) => partialAccordingButton.question,
		{ cascade: true },
	)
	partialAccordingButtons: PartialAccordingButton[];

	@OneToMany(
		() => AccordingButton,
		(accordingButton) => accordingButton.question,
		{ cascade: true },
	)
	accordingButtons: AccordingButton[];

	@ManyToMany(() => Grouping, { cascade: true })
	@JoinTable({
		name: 'groupings_questions',
		joinColumn: { name: 'questions_id' },
		inverseJoinColumn: { name: 'grouping_id' },
	})
	groupings?: Grouping[];

	@OneToOne(() => Answer, (answer) => answer.question, {
		cascade: true,
		nullable: true,
	})
	answer?: Answer;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
