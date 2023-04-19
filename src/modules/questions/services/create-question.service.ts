import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { AccordingButton } from 'src/modules/according-buttons/according-button.entity';
import { Grouping } from 'src/modules/groupings/grouping.entity';
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
		@InjectRepository(Grouping)
		private groupingsRepository: Repository<Grouping>,
	) {}

	async execute(createQuestionDTO: CreateQuestionDTO): Promise<Question> {
		let tags: Tag[] = [];
		let references: Reference[] = [];
		let accordingButtons: AccordingButton[] = [];
		let partialAccordingButtons: PartialAccordingButton[] = [];
		let groupings: Grouping[] = [];

		try {
			tags = await this.tagsRepository.find({
				where: {
					_eq: In(
						createQuestionDTO.tags.filter((tag) => isUUID(tag)),
					),
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

		try {
			references = await this.referencesRepository.find({
				where: {
					_eq: In(
						createQuestionDTO.references.filter((reference) =>
							isUUID(reference),
						),
					),
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

		try {
			groupings = await this.groupingsRepository.find({
				where: {
					_eq: In(createQuestionDTO.groupings),
				},
				relations: {
					questions: true,
				},
			});
		} catch (err) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the groupings in the create-question.service.ts',
				},
			);
		}

		const question = this.questionsRepository.create({
			id: createQuestionDTO.id,
			question: createQuestionDTO.question,
			func: createQuestionDTO.func,
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
		});

		question.tags = [...tags];
		question.references = [...references];

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

		accordingButtons = createQuestionDTO.accordingButtons.map((ab) => {
			return this.accordingButtonsRepository.create({
				label: ab,
				questionId: question._eq,
			});
		});

		partialAccordingButtons = createQuestionDTO.partialAccordingButtons.map(
			(pab) => {
				return this.partialAccordingButtonsRepository.create({
					label: pab,
					questionId: question._eq,
				});
			},
		);

		try {
			await this.accordingButtonsRepository.save(accordingButtons);
		} catch (err) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to save the according button in the create-question.service.ts',
				},
			);
		}

		try {
			await this.partialAccordingButtonsRepository.save(
				partialAccordingButtons,
			);
		} catch (err) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to save the partial according button in the create-question.service.ts',
				},
			);
		}

		groupings.map(async (g) => {
			g.questions.push(question);
			try {
				await this.groupingsRepository.save(g);
			} catch (err) {
				throw new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description:
							'This error occurred when trying to save the grouping in the create-question.service.ts',
					},
				);
			}
		});

		question.accordingButtons = accordingButtons;
		question.partialAccordingButtons = partialAccordingButtons;

		createQuestionDTO.tags.map(async (tag) => {
			if (tags.findIndex((t) => t._eq === tag) === -1) {
				try {
					const savedTag = await this.tagsRepository.save(
						this.tagsRepository.create({ label: tag }),
					);
					question.tags.push(savedTag);
					await this.questionsRepository.save(question);
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

		createQuestionDTO.references.map(async (reference) => {
			if (references.findIndex((r) => r._eq === reference) === -1) {
				try {
					const savedReference = await this.referencesRepository.save(
						this.referencesRepository.create({
							label: reference,
						}),
					);
					question.references.push(savedReference);
					await this.questionsRepository.save(question);
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

		return question;
	}
}
