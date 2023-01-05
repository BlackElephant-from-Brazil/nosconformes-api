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
exports.CreateUserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const constants_1 = require("../../../config/constants");
const typeorm_2 = require("typeorm");
const users_entity_1 = require("../users.entity");
let CreateUserService = class CreateUserService {
    constructor(usersRepository, generateHash) {
        this.usersRepository = usersRepository;
        this.generateHash = generateHash;
    }
    async execute({ profilePicture, name, email, password, office, accessLevel, }) {
        const hashedPassword = await this.generateHash({
            password,
        });
        const createdUser = this.usersRepository.create({
            profilePicture,
            name,
            email,
            password: hashedPassword,
            office,
            accessLevel,
        });
        await this.usersRepository.save(createdUser);
        return createdUser;
    }
};
CreateUserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(1, (0, common_1.Inject)(constants_1.HASH)),
    __metadata("design:paramtypes", [typeorm_2.Repository, Function])
], CreateUserService);
exports.CreateUserService = CreateUserService;
//# sourceMappingURL=create-user.service.js.map