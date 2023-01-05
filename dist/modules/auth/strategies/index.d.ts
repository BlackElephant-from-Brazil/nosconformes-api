import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.stratedy';
export declare const authStrategies: (typeof JwtStrategy | typeof LocalStrategy)[];
