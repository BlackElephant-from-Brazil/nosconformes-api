import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateQuestionariesEmployeesTable1681319163948
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'questionaries_employees',
				columns: [
					{
						name: 'questionary_id',
						type: 'uuid',
					},
					{
						name: 'employee_id',
						type: 'uuid',
					},
				],
				foreignKeys: [
					{
						name: 'QuestionaryQuestionariesEmployees',
						referencedTableName: 'questionaries',
						referencedColumnNames: ['_eq'],
						columnNames: ['questionary_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
					{
						name: 'EmployeeQuestionariesEmployees',
						referencedTableName: 'employees',
						referencedColumnNames: ['_eq'],
						columnNames: ['employee_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('questionaries_employees');
	}
}
