export type CreateQuestionDTO = {
	id: string;
	question: string;
	funcs: string[];
	threat: string;
	recommendation: string;
	description: string;
	accordingButtons: string[];
	partialAccordingButtons: string[];
};
