import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { LoginService } from '../services/login.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private loginService: LoginService) {
		super({
			usernameField: 'email',
		});
	}

	async validate(email: string, password: string): Promise<any> {
		const loggedUser = await this.loginService.execute({ email, password });

		return loggedUser;
	}
}
