import * as bcrypt from 'bcrypt';
import { COMPARE, HASH } from 'src/config/constants';

type HashDTO = {
  password: string;
};

type CompareDTO = {
  typedPassword: string;
  storedPassword: string;
};

export type GenerateHash = (data: HashDTO) => Promise<string>;
export type CompareHash = (data: CompareDTO) => Promise<boolean>;

const hash: GenerateHash = async ({ password }: HashDTO): Promise<string> => {
  const saltOrRounds = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, saltOrRounds);
  return hashedPassword;
};

const compare: CompareHash = async ({
  typedPassword,
  storedPassword,
}: CompareDTO): Promise<boolean> => {
  const validated = await bcrypt.compare(typedPassword, storedPassword);

  return validated;
};

export const bcryptProvider = [
  {
    provide: HASH,
    useFactory: hash,
  },
  {
    provide: COMPARE,
    useFactory: compare,
  },
];
