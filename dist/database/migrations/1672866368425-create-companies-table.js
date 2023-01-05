"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCompaniesTable1672866368425 = void 0;
const typeorm_1 = require("typeorm");
class CreateCompaniesTable1672866368425 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'companies',
            columns: [
                {
                    name: '_eq',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'logo',
                    type: 'varchar',
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'cnpj',
                    type: 'varchar',
                },
                {
                    name: 'site',
                    type: 'varchar',
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'now()',
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('companies');
    }
}
exports.CreateCompaniesTable1672866368425 = CreateCompaniesTable1672866368425;
//# sourceMappingURL=1672866368425-create-companies-table.js.map