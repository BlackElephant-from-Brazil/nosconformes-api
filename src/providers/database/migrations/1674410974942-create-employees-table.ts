import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEmployeesTable1674410974942 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'employees',
				columns: [
					{
						name: '_eq',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'name',
						type: 'varchar',
					},
					{
						name: 'profile_picture',
						type: 'varchar',
					},
					{
						name: 'email',
						type: 'varchar',
					},
					{
						name: 'password',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'department',
						type: 'varchar',
					},
					{
						name: 'office',
						type: 'varchar',
					},
					{
						name: 'phone',
						type: 'varchar',
						length: '11',
					},
					{
						name: 'access_level',
						type: 'varchar',
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
						name: 'EmployeeCompany',
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
		await queryRunner.dropTable('employees');
	}
}
