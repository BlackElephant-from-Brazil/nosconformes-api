import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY, MAIL_PASSWORD, MAIL_USER } from 'src/config/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { authServices } from './services';
import { authStrategies } from './strategies';
import { authControllers } from './controllers';
import { BCryptProvider } from 'src/providers/encriptation/bcrypt.provider';
import { MailerModule } from '@nestjs-modules/mailer';
import { Protocol } from '../protocol/protocol.entity';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

@Module({
	imports: [
		UsersModule,
		PassportModule.register({ property: 'authenticated' }),
		JwtModule.register({
			secret: JWT_SECRET_KEY,
			signOptions: { expiresIn: '10h' },
		}),
		TypeOrmModule.forFeature([User, Protocol]),
		MailerModule.forRoot({
			transport: {
				host: 'smtp.mailgun.org',
				secure: false,
				port: 587,
				auth: {
					user: configService.get(MAIL_USER),
					pass: configService.get(MAIL_PASSWORD),
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
