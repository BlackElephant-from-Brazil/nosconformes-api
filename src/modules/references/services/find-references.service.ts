import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reference } from '../reference.entity';

@Injectable()
export class FindReferencesService {
	constructor(
		@InjectRepository(Reference)
		private referencesRepository: Repository<Reference>,
	) {}

	async execute(): Promise<Reference[]> {
		let references: Reference[] = [];

		try {
			references = await this.referencesRepository.find();
		} catch (error) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the references in the find-references.service.ts',
				},
			);
		}

		return references;
	}
}
