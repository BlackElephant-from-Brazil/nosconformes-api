"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../database/database.module");
const managers_module_1 = require("../managers/managers.module");
const companies_provider_1 = require("./companies.provider");
const company_controller_1 = require("./company.controller");
const company_service_1 = require("./company.service");
let CompaniesModule = class CompaniesModule {
};
CompaniesModule = __decorate([
    (0, common_1.Module)({
        imports: [managers_module_1.ManagersModule, database_module_1.DatabaseModule],
        controllers: [company_controller_1.CompaniesController],
        providers: [company_service_1.CompaniesService, ...companies_provider_1.companyProviders],
    })
], CompaniesModule);
exports.CompaniesModule = CompaniesModule;
//# sourceMappingURL=company.module.js.map