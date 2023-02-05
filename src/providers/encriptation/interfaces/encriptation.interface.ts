type HashDTO = {
	password: string;
};

type CompareDTO = {
	typedPassword: string;
	storedPassword: string;
};

export interface EncriptationInterface {
	hash: (data: HashDTO) => Promise<string>;
	compare: (data: CompareDTO) => Promise<boolean>;
}
