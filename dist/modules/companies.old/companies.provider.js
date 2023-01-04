"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyProviders = void 0;
const constants_1 = require("../../config/constants");
const companies_entity_1 = require("./companies.entity");
exports.companyProviders = [
    {
        provide: constants_1.COMPANIES_REPOSITORY,
        useFactory: (dataSource) => dataSource.getRepository(companies_entity_1.CompaniesEntity),
        inject: [constants_1.DATA_SOURCE],
    },
];
//# sourceMappingURL=companies.provider.js.map