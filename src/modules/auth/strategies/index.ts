import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.stratedy';

export const authStrategies = [JwtStrategy, LocalStrategy];
