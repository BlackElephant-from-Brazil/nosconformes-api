import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Protocol } from '../protocol/protocol.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	_eq: string;

	@Column({ name: 'profile_picture' })
	profilePicture: string;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column()
	office: string;

	@Column({ name: 'access_level' })
	accessLevel: 'master' | 'manager' | 'auditor' | 'consultor';

	@OneToMany(() => Protocol, (protocol) => protocol.user)
	protocols: Protocol[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
