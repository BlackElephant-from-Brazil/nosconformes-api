export type CreateQuestionDTO = {
	id: string;
	question: string;
	groupings: string;
	funcs: string[];
	threat: string;
	recommendation: string;
	description: string;
	priority: number;
	probability: number;
	impact: number;
	partialAccordingAllowInformation: boolean;
	nonAccordingAllowInformation: boolean;
	references: string[];
	tags: string[];
	partialAccordingButtons: string[];
	accordingButtons: string[];
};
