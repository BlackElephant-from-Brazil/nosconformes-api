import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { messagesControllers } from './controllers';
import { Message } from './message.entity';
import { messagesServices } from './services';

@Module({
	imports: [TypeOrmModule.forFeature([Message])],
	providers: [...messagesServices],
	controllers: [...messagesControllers],
})
export class MessagesModule {}
