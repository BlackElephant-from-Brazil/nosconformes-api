"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const constants_1 = require("../../../config/constants");
const users_entity_1 = require("../../users/users.entity");
const typeorm_2 = require("typeorm");
let LoginService = class LoginService {
    constructor(usersRepository, jwtService, compareHash) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.compareHash = compareHash;
    }
    async execute({ email, password }) {
        let user;
        try {
            user = await this.usersRepository.findOne({
                where: {
                    email,
                },
            });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException();
        }
        if (!user)
            throw new Error('Oops! Email or password does not match!');
        const passwordValidated = await this.compareHash({
            storedPassword: user.password,
            typedPassword: password,
        });
        if (!passwordValidated)
            throw new Error('Oops! Email or password does not match!');
        delete user.password;
        const payload = {
            email: user.email,
            sub: user._eq,
        };
        const accessToken = this.jwtService.sign(payload);
        const loggedUser = {
            user,
            accessToken,
        };
        return loggedUser;
    }
};
LoginService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(2, (0, common_1.Inject)(constants_1.COMPARE)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService, Function])
], LoginService);
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map