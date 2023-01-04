"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("../users/users.module");
const passport_1 = require("@nestjs/passport");
const local_stratedy_1 = require("./strategies/local.stratedy");
const jwt_1 = require("@nestjs/jwt");
const constants_1 = require("../../config/constants");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const login_service_1 = require("./services/login.service");
const find_user_by_email_service_1 = require("../users/services/find-user-by-email.service");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../users/users.entity");
const auth_controller_1 = require("./auth.controller");
const change_password_service_1 = require("./services/change-password.service");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: constants_1.JWT_SECRET_KEY,
                signOptions: { expiresIn: '10h' },
            }),
            typeorm_1.TypeOrmModule.forFeature([users_entity_1.User]),
        ],
        providers: [
            local_stratedy_1.LocalStrategy,
            jwt_strategy_1.JwtStrategy,
            login_service_1.LoginService,
            find_user_by_email_service_1.FindUserByEmailService,
            change_password_service_1.ChangePasswordService,
        ],
        controllers: [auth_controller_1.AuthController],
        exports: [],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map