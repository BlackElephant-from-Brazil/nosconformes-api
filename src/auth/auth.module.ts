import { Module } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { LocalStrategy } from 'src/modules/auth/local.stratedy';
import { UsersModule } from 'src/modules/users/users.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
