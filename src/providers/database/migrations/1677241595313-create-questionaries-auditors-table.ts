import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateQuestionariesAuditorsTable1677241595313
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'questionaries_auditors',
				columns: [
					{
						name: 'questionary_id',
						type: 'uuid',
					},
					{
						name: 'auditor_id',
						type: 'uuid',
					},
				],
				foreignKeys: [
					{
						name: 'QuestionaryQuestionariesAuditors',
						referencedTableName: 'questionaries',
						referencedColumnNames: ['_eq'],
						columnNames: ['questionary_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
					{
						name: 'AuditorQuestionariesAuditors',
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
		await queryRunner.dropTable('questionaries_auditors');
	}
}
