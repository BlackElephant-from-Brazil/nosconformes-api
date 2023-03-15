export type UpdateUserDTO = {
	profilePicture: string;
	name: string;
	email: string;
	office: string;
	accessLevel: 'master' | 'gestor' | 'auditor' | 'consultor';
};
