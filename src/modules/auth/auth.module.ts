import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from 'src/config/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { AuthController } from './auth.controller';
import { authServices } from './services';
import { authStrategies } from './strategies';

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
  providers: [...authStrategies, ...authServices],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
