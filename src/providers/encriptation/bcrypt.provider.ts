import * as bcrypt from 'bcrypt';
import { EncriptationInterface } from './interfaces/encriptation.interface';

export class BCryptProvider implements EncriptationInterface {
	hash = async ({ password }): Promise<string> => {
		const saltOrRounds = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, saltOrRounds);
		return hashedPassword;
	};

	compare = async ({ typedPassword, storedPassword }): Promise<boolean> => {
		const validated = await bcrypt.compare(typedPassword, storedPassword);

		return validated;
	};
}
