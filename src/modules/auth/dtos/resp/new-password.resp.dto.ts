import { ApiProperty } from '@nestjs/swagger';
import { Response } from 'src/interfaces/response';
import { User } from 'src/modules/users/users.entity';

export class NewPasswordRespDTO implements Response {
	@ApiProperty({
		description: 'Success response',
		example: true,
	})
	_success: boolean;

	@ApiProperty({
		description: 'Success response',
		example: {
			_eq: 'valid-uuid',
			accessLevel: 'master',
			createdAt: new Date(),
			email: 'gui.sartori96@gmail.com',
			name: 'Guilherme Sartori',
			office: 'Analista',
			profilePicture: 'https://localhost:3333/profile-picture-url.png',
			updatedAt: new Date(),
		} as Omit<User, 'password'>,
	})
	user: Omit<User, 'password'>;
}
