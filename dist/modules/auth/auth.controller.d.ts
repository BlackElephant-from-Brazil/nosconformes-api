import { Response } from 'express';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { NewPasswordDTO } from './dtos/new-password.dto';
import { ChangePasswordService } from './services/change-password.service';
export declare class AuthController {
    private changePasswordService;
    constructor(changePasswordService: ChangePasswordService);
    login(req: RequestWithUser, res: Response): Promise<void>;
    changePassword(newPasswordDTO: NewPasswordDTO, res: Response): Promise<void>;
}
