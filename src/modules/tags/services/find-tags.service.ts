import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../tag.entity';

@Injectable()
export class FindTagsService {
	constructor(
		@InjectRepository(Tag)
		private tagsRepository: Repository<Tag>,
	) {}

	async execute(): Promise<Tag[]> {
		let tags: Tag[] = [];

		try {
			tags = await this.tagsRepository.find();
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the tags in the find-tags.service.ts',
				},
			);
		}

		return tags;
	}
}
