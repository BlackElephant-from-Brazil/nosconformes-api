import { Response } from 'express';
import { CreateUserDTO } from './dtos/create-user.dto';
import { CreateUserService } from './services/create-user.service';
import { FindUsersService } from './services/find-users.service';
export declare class UsersController {
    private readonly createUserService;
    private readonly findUsersService;
    constructor(createUserService: CreateUserService, findUsersService: FindUsersService);
    create(user: CreateUserDTO, res: Response): Promise<void>;
    read(query: string, res: Response): Promise<void>;
}
