import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncriptationModule } from 'src/providers/encriptation/encriptation.module';
import { usersServices } from './services';
import { User } from './users.entity';
import { usersControllers } from './controllers';

@Module({
	imports: [TypeOrmModule.forFeature([User]), EncriptationModule],
	providers: [...usersServices],
	controllers: [...usersControllers],
})
export class UsersModule {}
