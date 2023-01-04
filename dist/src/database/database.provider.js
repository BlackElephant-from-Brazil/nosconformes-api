"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const constants_1 = require("../config/constants");
const ormDataSource_1 = require("./ormDataSource");
exports.databaseProviders = [
    {
        provide: constants_1.DATA_SOURCE,
        useFactory: async () => {
            return ormDataSource_1.dataSource.initialize();
        },
    },
];
//# sourceMappingURL=database.provider.js.map