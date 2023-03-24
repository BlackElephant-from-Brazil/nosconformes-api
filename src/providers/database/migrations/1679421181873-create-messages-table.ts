import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMessagesTable1679421181873 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'messages',
				columns: [
					{
						name: '_eq',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'text',
						type: 'varchar',
					},
					{
						name: 'read',
						type: 'boolean',
					},
					{
						name: 'user_id',
						type: 'uuid',
						isNullable: true,
					},
					{
						name: 'employee_id',
						type: 'uuid',
						isNullable: true,
					},
					{
						name: 'question_id',
						type: 'uuid',
					},
					{
						name: 'company_id',
						type: 'uuid',
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
				foreignKeys: [
					{
						name: 'UserMessages',
						referencedTableName: 'users',
						referencedColumnNames: ['_eq'],
						columnNames: ['user_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
					{
						name: 'EmployeeMessages',
						referencedTableName: 'employees',
						referencedColumnNames: ['_eq'],
						columnNames: ['employee_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
					{
						name: 'QuestionMessages',
						referencedTableName: 'questions',
						referencedColumnNames: ['_eq'],
						columnNames: ['question_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
					{
						name: 'CompanyMessages',
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
		await queryRunner.dropTable('messages');
	}
}
