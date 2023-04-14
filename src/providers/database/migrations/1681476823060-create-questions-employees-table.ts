import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateQuestionsEmployeesTable1681476823060
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'questions_employees',
				columns: [
					{
						name: 'question_id',
						type: 'uuid',
					},
					{
						name: 'employee_id',
						type: 'uuid',
					},
				],
				foreignKeys: [
					{
						name: 'QuestionQuestionsEmployees',
						referencedTableName: 'questions',
						referencedColumnNames: ['_eq'],
						columnNames: ['question_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
					{
						name: 'EmployeeQuestionsEmployees',
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
		await queryRunner.dropTable('questions_employees');
	}
}
