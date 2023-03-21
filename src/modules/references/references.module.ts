import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { referencesControllers } from './controllers';
import { Reference } from './reference.entity';
import { referencesServices } from './services';

@Module({
	imports: [TypeOrmModule.forFeature([Reference])],
	providers: [...referencesServices],
	controllers: [...referencesControllers],
})
export class ReferencesModule {}
