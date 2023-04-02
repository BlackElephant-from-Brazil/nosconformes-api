import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAnswersTable1679427039510 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'answers',
				columns: [
					{
						name: '_eq',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'status',
						type: 'varchar',
					},
					{
						name: 'conformity',
						type: 'varchar',
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
						name: 'QuestionAnswers',
						referencedTableName: 'questions',
						referencedColumnNames: ['_eq'],
						columnNames: ['question_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
					{
						name: 'CompanyAnswers',
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
		await queryRunner.dropTable('answers');
	}
}
