import {
  Controller,
  Post,
  UseGuards,
  Res,
  HttpStatus,
  Req,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { NewPasswordDTO } from './dtos/new-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ChangePasswordService } from './services/change-password.service';

@Controller('auth')
export class AuthController {
  constructor(private changePasswordService: ChangePasswordService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser, @Res() res: Response) {
    res.json(req.user).status(HttpStatus.OK);
  }

  @Post('change-password')
  async changePassword(
    @Body() newPasswordDTO: NewPasswordDTO,
    @Res() res: Response,
  ) {
    const user = await this.changePasswordService.execute(newPasswordDTO);

    res.json(user).status(HttpStatus.OK);
  }
}
