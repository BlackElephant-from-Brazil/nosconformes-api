"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
const constants_1 = require("../config/constants");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
exports.dataSource = new typeorm_1.DataSource({
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: configService.get(constants_1.POSTGRES_PORT) || 5432,
    username: configService.get(constants_1.POSTGRES_USERNAME),
    password: configService.get(constants_1.POSTGRES_PASSWORD),
    database: configService.get(constants_1.POSTGRES_DATABASE),
    migrationsTableName: 'migrations',
});
//# sourceMappingURL=ormDataSource.js.map