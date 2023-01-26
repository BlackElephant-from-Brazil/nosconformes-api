export type CreateUserDTO = {
	profilePicture: string;
	name: string;
	email: string;
	password: string;
	office: string;
	accessLevel: 'master' | 'manager' | 'auditor' | 'consultor';
};
