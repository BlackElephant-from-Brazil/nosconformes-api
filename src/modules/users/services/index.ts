import { CreateUserService } from './create-user.service';
import { DeleteUserPhotoService } from './delete-user-photo.service';
import { DeleteUserService } from './delete-user.service';
import { FindUserByIdService } from './find-user-by-id.service';
import { FindUsersService } from './find-users.service';
import { UpdateUserPhotoService } from './update-user-photo.service';
import { UpdateUserService } from './update-user.service';

export const usersServices = [
	CreateUserService,
	FindUsersService,
	DeleteUserService,
	FindUserByIdService,
	UpdateUserService,
	DeleteUserPhotoService,
	UpdateUserPhotoService,
];
