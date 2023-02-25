import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateQuestionariesCompaniesTable1677241604242
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'questionaries_companies',
				columns: [
					{
						name: 'questionary_id',
						type: 'uuid',
					},
					{
						name: 'company_id',
						type: 'uuid',
					},
				],
				foreignKeys: [
					{
						name: 'QuestionaryQuestionariesCompanies',
						referencedTableName: 'questionaries',
						referencedColumnNames: ['_eq'],
						columnNames: ['questionary_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
					{
						name: 'CompanyQuestionariesCompanies',
						referencedTableName: 'companies',
						referencedColumnNames: ['_eq'],
						columnNames: ['company_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('questionaries_companies');
	}
}
