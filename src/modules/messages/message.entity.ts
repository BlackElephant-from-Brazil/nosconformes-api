import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Employee } from '../employees/employee.entity';
import { User } from '../users/users.entity';

@Entity('messages')
export class Message {
	@PrimaryGeneratedColumn('uuid')
	_eq: string;

	@Column()
	text: string;

	@Column()
	read: boolean;

	@Column({ name: 'user_id' })
	userId: string;

	@ManyToOne(() => User, (user) => user.messages)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column({ name: 'employee_id' })
	employeeId: string;

	@ManyToOne(() => Employee, (employee) => employee.messages)
	@JoinColumn({ name: 'employee_id' })
	employee: Employee;

	@Column({ name: 'question_id' })
	questionId: string;

	@Column({ name: 'company_id' })
	companyId: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
