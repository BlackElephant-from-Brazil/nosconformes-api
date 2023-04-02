import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateQuestionariesCompaniesAuditorsTable1678288473131
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'questionaries_companies_auditors',
				columns: [
					{
						name: 'questionary_company_id',
						type: 'uuid',
					},
					{
						name: 'auditor_id',
						type: 'uuid',
					},
				],
				foreignKeys: [
					{
						name: 'QuestionariesCompaniesQuestionariesCompaniesAuditors',
						referencedTableName: 'questionaries_companies',
						referencedColumnNames: ['_eq'],
						columnNames: ['questionary_company_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
					{
						name: 'AuditorQuestionariesCompaniesAuditors',
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
		await queryRunner.dropTable('questionaries_companies_auditors');
	}
}
