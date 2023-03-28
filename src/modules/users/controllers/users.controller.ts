import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { CreateUserService } from '../services/create-user.service';
import { DeleteUserPhotoService } from '../services/delete-user-photo.service';
import { DeleteUserService } from '../services/delete-user.service';
import { FindUserByIdService } from '../services/find-user-by-id.service';
import { FindUsersService } from '../services/find-users.service';
import { UpdateUserPhotoService } from '../services/update-user-photo.service';
import { UpdateUserService } from '../services/update-user.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
	constructor(
		private readonly createUserService: CreateUserService,
		private readonly findUsersService: FindUsersService,
		private readonly updateUserService: UpdateUserService,
		private readonly deleteUserService: DeleteUserService,
		private readonly findUserByIdService: FindUserByIdService,
		private readonly deleteUserPhotoService: DeleteUserPhotoService,
		private readonly updateUserPhotoService: UpdateUserPhotoService,
	) {}

	@Post()
	async create(@Body() createUserDTO: CreateUserDTO, @Res() res: Response) {
		const createdUser = await this.createUserService.execute(createUserDTO);
		res.json(createdUser).status(HttpStatus.CREATED);
	}

	@Get()
	async read(@Query('query') query: string, @Res() res: Response) {
		const users = await this.findUsersService.execute(query);
		res.json(users).status(HttpStatus.OK);
	}

	@Put(':id')
	async update(
		@Param('id') userId: string,
		@Body() updateUserDto: UpdateUserDTO,
		@Res() res: Response,
	) {
		const users = await this.updateUserService.execute(
			userId,
			updateUserDto,
		);
		res.json(users).status(HttpStatus.OK);
	}

	@Delete(':id')
	async delete(@Param('id') userId: string, @Res() res: Response) {
		const users = await this.deleteUserService.execute(userId);
		res.json(users).status(HttpStatus.OK);
	}

	@Get(':id')
	async show(@Param('id') userId: string, @Res() res: Response) {
		const users = await this.findUserByIdService.execute(userId);
		res.json(users).status(HttpStatus.OK);
	}

	@Delete(':id/photo')
	async deletePhoto(@Param('id') userId: string, @Res() res: Response) {
		await this.deleteUserPhotoService.execute(userId);

		res.status(HttpStatus.OK).send();
	}

	@Post(':id/photo')
	@UseInterceptors(
		FileInterceptor('photo', {
			storage: diskStorage({
				destination: './uploads',
				filename: (req, file, cb) => {
					const filename = `${Date.now()}-${file.originalname}`;
					cb(null, filename);
				},
			}),
		}),
	)
	async uploadLogo(
		@Param('id') companyId: string,
		@UploadedFile() photo: Express.Multer.File,
		@Res() res: Response,
	) {
		const uploadedPhotoUrl = await this.updateUserPhotoService.execute(
			companyId,
			photo.path,
		);

		res.json(uploadedPhotoUrl).status(HttpStatus.OK);
	}
}
