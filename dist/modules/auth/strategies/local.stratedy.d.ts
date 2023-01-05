import { Strategy } from 'passport-local';
import { LoginService } from '../services/login.service';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private loginService;
    constructor(loginService: LoginService);
    validate(email: string, password: string): Promise<any>;
}
export {};
