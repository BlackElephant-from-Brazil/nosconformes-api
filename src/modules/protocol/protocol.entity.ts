import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity('protocols')
export class Protocol {
	@PrimaryGeneratedColumn('uuid')
	_eq: string;

	@Column()
	_protocol: string;

	@Column({ name: 'user_id' })
	userId: string;

	@ManyToOne(() => User, (user) => user.protocols)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
