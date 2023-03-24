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

@Entity('answers')
export class Answer {
	@PrimaryGeneratedColumn('uuid')
	_eq: string;

	@Column()
	status: 'approved' | 'pending' | 'rejected';

	@Column()
	conformity: 'conform' | 'partial' | 'non-conform';

	@Column({ name: 'company_id' })
	companyId: string;

	@Column({ name: 'question_id' })
	questionId: string;

	@ManyToOne(() => Question)
	@JoinColumn({ name: 'question_id' })
	question: Question;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
