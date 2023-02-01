import { ChangePasswordService } from './change-password.service';
import { ForgotPasswordService } from './forgot-password.service';
import { LoginService } from './login.service';

export const authServices = [
	ChangePasswordService,
	LoginService,
	ForgotPasswordService,
];
