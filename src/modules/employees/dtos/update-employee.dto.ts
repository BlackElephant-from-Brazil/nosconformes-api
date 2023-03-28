export type UpdateEmployeeDTO = {
	profilePicture: string;
	name: string;
	email: string;
	office: string;
	accessLevel: 'stackholder' | 'patrocinador';
};
