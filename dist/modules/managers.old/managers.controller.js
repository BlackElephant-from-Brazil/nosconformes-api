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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagersController = void 0;
const common_1 = require("@nestjs/common");
const managers_service_1 = require("./managers.service");
let ManagersController = class ManagersController {
    constructor(managersService) {
        this.managersService = managersService;
    }
    getHello() {
        return this.managersService.getHello();
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], ManagersController.prototype, "getHello", null);
ManagersController = __decorate([
    (0, common_1.Controller)('managers'),
    __metadata("design:paramtypes", [managers_service_1.ManagersService])
], ManagersController);
exports.ManagersController = ManagersController;
//# sourceMappingURL=managers.controller.js.map