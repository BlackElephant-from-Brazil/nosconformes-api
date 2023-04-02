import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePartialAccordingButtonsTable1679261568432
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'partial_according_buttons',
				columns: [
					{
						name: '_eq',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'label',
						type: 'varchar',
					},
					{
						name: 'question_id',
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
						name: 'PartialAccordingButtonQuestion',
						referencedTableName: 'questions',
						referencedColumnNames: ['_eq'],
						columnNames: ['question_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('partial_according_buttons');
	}
}
