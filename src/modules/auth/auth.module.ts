import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.stratedy';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from 'src/config/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginService } from './services/login.service';
import { FindUserByEmailService } from '../users/services/find-user-by-email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { AuthController } from './auth.controller';
import { ChangePasswordService } from './services/change-password.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: '10h' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    LoginService,
    FindUserByEmailService,
    ChangePasswordService,
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
