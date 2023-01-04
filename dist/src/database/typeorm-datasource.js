"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = exports.databaseConfigurations = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const constants_1 = require("../config/constants");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
exports.databaseConfigurations = {
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: configService.get(constants_1.POSTGRES_PORT) || 5432,
    username: configService.get(constants_1.POSTGRES_USERNAME),
    password: configService.get(constants_1.POSTGRES_PASSWORD),
    database: configService.get(constants_1.POSTGRES_DATABASE),
    migrationsTableName: 'migrations',
    entities: [(0, path_1.resolve)(__dirname, '..', 'modules', '**', '**.entity{.ts,.js}')],
    migrations: [(0, path_1.resolve)(__dirname, 'migrations', '*{.ts,.js}')],
    subscribers: [(0, path_1.resolve)(__dirname, 'subscriber', '*{.ts,.js}')],
};
exports.dataSource = new typeorm_1.DataSource(exports.databaseConfigurations);
//# sourceMappingURL=typeorm-datasource.js.map