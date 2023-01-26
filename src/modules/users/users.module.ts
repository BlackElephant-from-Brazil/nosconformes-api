import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncriptationModule } from 'src/providers/encriptation/encriptation.module';
import { usersServices } from './services';
import { UsersController } from './users.controller';
import { User } from './users.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User]), EncriptationModule],
	providers: [...usersServices],
	controllers: [UsersController],
})
export class UsersModule {}
