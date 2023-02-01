import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from 'src/config/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { authServices } from './services';
import { authStrategies } from './strategies';
import { authControllers } from './controllers';
import { BCryptProvider } from 'src/providers/encriptation/bcrypt.provider';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
	imports: [
		UsersModule,
		PassportModule.register({ property: 'authenticated' }),
		JwtModule.register({
			secret: JWT_SECRET_KEY,
			signOptions: { expiresIn: '10h' },
		}),
		TypeOrmModule.forFeature([User]),
		MailerModule.forRoot({
			transport: {
				host: 'smtp.mailgun.org',
				secure: false,
				port: 587,
				auth: {
					user: 'postmaster@sandboxf4ea7cb9ef1540e491d02168733077bb.mailgun.org',
					pass: '09a312c434f6a5ce8fb0b3a1fc97ef00-75cd784d-79c0616c',
				},
				ignoreTLS: true,
			},
			defaults: {
				from: '"',
			},
		}),
	],
	providers: [...authStrategies, ...authServices, BCryptProvider],
	controllers: [...authControllers],
})
export class AuthModule {}
