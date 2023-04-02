export type CreateQuestionDTO = {
	id: string;
	question: string;
	groupings: string[];
	func: string;
	threat: string;
	recommendation: string;
	description: string;
	priority: number; // finish this
	probability: number; // finish this
	impact: number; // finish this
	partialAccordingAllowInformation: boolean;
	nonAccordingAllowInformation: boolean;
	references: string[];
	tags: string[];
	partialAccordingButtons: string[];
	accordingButtons: string[];
};
