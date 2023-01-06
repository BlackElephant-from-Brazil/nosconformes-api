import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from 'src/config/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { authServices } from './services';
import { authStrategies } from './strategies';
import { EncriptationModule } from 'src/providers/encriptation/encriptation.module';
import { authControllers } from './controllers';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: '10h' },
    }),
    TypeOrmModule.forFeature([User]),
    EncriptationModule,
  ],
  providers: [...authStrategies, ...authServices],
  controllers: [...authControllers],
  exports: [],
})
export class AuthModule {}
