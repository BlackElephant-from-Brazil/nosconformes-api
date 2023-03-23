import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/modules/questions/question.entity';
import { Repository } from 'typeorm';

type FindAnswersFromCompanyFromGroupingServiceResponse = {
	approvedAnsweredQuestions: Question[];
	pendingAnsweredQuestions: Question[];
	rejectedAnsweredQuestions: Question[];
	nonAnsweredQuestions: Question[];
};

@Injectable()
export class FindAnswersFromCompanyFromGroupingService {
	constructor(
		@InjectRepository(Question)
		private questionsRepository: Repository<Question>,
	) {}

	async execute(
		companyId: string,
		groupingId: string,
	): Promise<FindAnswersFromCompanyFromGroupingServiceResponse> {
		let questions: Question[];
		try {
			questions = await this.questionsRepository.find({
				where: {
					groupings: {
						_eq: groupingId,
					},
				},
				relations: {
					answer: true,
					tags: true,
					references: true,
					groupings: true,
				},
			});
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description:
						'This error occurred when trying to find the questions in the find-answers-from-company-from-grouping.service.ts',
				},
			);
		}

		return {
			approvedAnsweredQuestions: [
				...questions.filter(
					(question) => question.answer?.status === 'approved',
				),
			],
			pendingAnsweredQuestions: [
				...questions.filter(
					(question) => question.answer?.status === 'pending',
				),
			],
			rejectedAnsweredQuestions: [
				...questions.filter(
					(question) => question.answer?.status === 'rejected',
				),
			],
			nonAnsweredQuestions: [
				...questions.filter((question) => !question.answer),
			],
		};
	}
}
