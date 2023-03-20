import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tagsControllers } from './controllers';
import { tagsServices } from './services';
import { Tag } from './tag.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Tag])],
	providers: [...tagsServices],
	controllers: [...tagsControllers],
})
export class TagsModule {}
