export type CreateEmployeeDTO = {
	profilePicture: string;
	name: string;
	email: string;
	office: string;
	department?: string;
	accessLevel: 'patrocinador' | 'stackholder';
	phone: string;
};
