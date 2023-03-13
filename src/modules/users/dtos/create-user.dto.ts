export type CreateUserDTO = {
	profilePicture: string;
	name: string;
	email: string;
	office: string;
	accessLevel: 'master' | 'manager' | 'auditor' | 'consultor';
	phone: string;
};
