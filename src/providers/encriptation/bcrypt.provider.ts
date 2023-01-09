import * as bcrypt from 'bcrypt';

type HashDTO = {
  password: string;
};

type CompareDTO = {
  typedPassword: string;
  storedPassword: string;
};

export class BCryptProvider {
  hash = async ({ password }: HashDTO): Promise<string> => {
    const saltOrRounds = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  };

  compare = async ({
    typedPassword,
    storedPassword,
  }: CompareDTO): Promise<boolean> => {
    const validated = await bcrypt.compare(typedPassword, storedPassword);

    return validated;
  };
}
