import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccordingButton } from 'src/modules/according-buttons/according-button.entity';
import { PartialAccordingButton } from 'src/modules/partial-according-buttons/partial-according-button.entity';
import { Reference } from 'src/modules/references/reference.entity';
import { Tag } from 'src/modules/tags/tag.entity';
import { In, Repository } from 'typeorm';
import { CreateQuestionDTO } from '../dtos/create-question.dto';
import { Question } from '../question.entity';

@Injectable()
export class CreateQuestionService {
	constructor(
		@InjectRepository(Question)
		private questionsRepository: Repository<Question>,
		@InjectRepository(Tag)
		private tagsRepository: Repository<Tag>,
		@InjectRepository(Reference)
		private referencesRepository: Repository<Reference>,
		@InjectRepository(AccordingButton)
		private accordingButtonsRepository: Repository<AccordingButton>,
		@InjectRepository(PartialAccordingButton)
		private partialAccordingButtonsRepository: Repository<PartialAccordingButton>,
	) {}

	async execute(createQuestionDTO: CreateQuestionDTO): Promise<Question> {
		let tags: Tag[] = [];
		let references: Reference[] = [];
		let accordingButtons: AccordingButton[] = [];
		let partialAccordingButtons: PartialAccordingButton[] = [];
		try {
			tags = await this.tagsRepository.find({
				where: {
					_eq: In(createQuestionDTO.tags),
				},
			});
		} catch (err) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the tags in the create-question.service.ts',
				},
			);
		}

		createQuestionDTO.tags.map(async (tag) => {
			if (tags.findIndex((t) => t._eq === tag) === -1) {
				try {
					const newTag = await this.tagsRepository.save(
						this.tagsRepository.create({ label: tag }),
					);
					tags.push(newTag);
				} catch (err) {
					throw new InternalServerErrorException(
						'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
						{
							description:
								'This error occurred when trying to save the new tag in the create-question.service.ts',
						},
					);
				}
			}
		});

		try {
			references = await this.referencesRepository.find({
				where: {
					_eq: In(createQuestionDTO.references),
				},
			});
		} catch (err) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the references in the create-question.service.ts',
				},
			);
		}

		createQuestionDTO.references.map(async (reference) => {
			if (references.findIndex((r) => r._eq === reference) === -1) {
				try {
					const newReference = await this.referencesRepository.save(
						this.referencesRepository.create({ label: reference }),
					);
					references.push(newReference);
				} catch (err) {
					throw new InternalServerErrorException(
						'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
						{
							description:
								'This error occurred when trying to save the new tag in the create-question.service.ts',
						},
					);
				}
			}
		});

		accordingButtons = createQuestionDTO.accordingButtons.map((ab) => {
			return this.accordingButtonsRepository.create({
				label: ab,
			});
		});

		partialAccordingButtons = createQuestionDTO.partialAccordingButtons.map(
			(pab) => {
				return this.partialAccordingButtonsRepository.create({
					label: pab,
				});
			},
		);

		const question = this.questionsRepository.create({
			id: createQuestionDTO.id,
			question: createQuestionDTO.question,
			funcs: createQuestionDTO.funcs,
			threat: createQuestionDTO.threat,
			recommendation: createQuestionDTO.recommendation,
			description: createQuestionDTO.description,
			priority: createQuestionDTO.priority,
			probability: createQuestionDTO.probability,
			impact: createQuestionDTO.impact,
			partialAccordingAllowInformation:
				createQuestionDTO.partialAccordingAllowInformation,
			nonAccordingAllowInformation:
				createQuestionDTO.nonAccordingAllowInformation,
			tags,
			references,
		});

		try {
			await this.questionsRepository.save(question);
		} catch (err) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to save the question in the create-question.service.ts',
				},
			);
		}

		accordingButtons.map(async (ab) => {
			ab.questionId = question.id;
			try {
				await this.accordingButtonsRepository.save(ab);
			} catch (err) {
				throw new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description:
							'This error occurred when trying to save the according button in the create-question.service.ts',
					},
				);
			}
		});

		partialAccordingButtons.map(async (pab) => {
			pab.questionId = question.id;
			try {
				await this.partialAccordingButtonsRepository.save(pab);
			} catch (err) {
				throw new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description:
							'This error occurred when trying to save the partial according button in the create-question.service.ts',
					},
				);
			}
		});

		question.accordingButtons = accordingButtons;
		question.partialAccordingButtons = partialAccordingButtons;

		return question;
	}
}
