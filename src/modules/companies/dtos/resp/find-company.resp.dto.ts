export type FindCompanyResp = {
	_eq: string;
	name: string;
	logo: string;
	auditors: {
		_eq: string;
		name: string;
		photo: string;
	}[];
};
