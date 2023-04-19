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
import { AccordingButton } from '../according-buttons/according-button.entity';

@Entity('according_buttons_files')
export class AccordingButtonFile {
	@PrimaryGeneratedColumn('uuid')
	_eq: string;

	@Column({ name: 'according_button_id' })
	accordingButtonId: string;

	@Column({ name: 'file_path' })
	filePath: string;

	@ManyToOne(
		() => AccordingButton,
		(accordingButton) => accordingButton.accordingButtonFiles,
	)
	@JoinColumn({ name: 'according_button_id' })
	accordingButton: AccordingButton;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
