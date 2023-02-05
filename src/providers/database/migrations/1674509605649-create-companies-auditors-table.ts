import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCompaniesAuditorsTable1674509605649
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'companies_auditors',
				columns: [
					{
						name: 'company_id',
						type: 'uuid',
					},
					{
						name: 'auditor_id',
						type: 'uuid',
					},
				],
				foreignKeys: [
					{
						name: 'CompanyCompaniesAuditors',
						referencedTableName: 'companies',
						referencedColumnNames: ['_eq'],
						columnNames: ['company_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
					{
						name: 'AuditorCompaniesAuditors',
						referencedTableName: 'users',
						referencedColumnNames: ['_eq'],
						columnNames: ['auditor_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('companies_auditors');
	}
}
