import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAccordingButtonsFilesTable1681846721042
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'according_buttons_files',
				columns: [
					{
						name: '_eq',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'according_button_id',
						type: 'uuid',
					},
					{
						name: 'file_path',
						type: 'varchar',
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
						name: 'AccordingButtonAccordingButtonsFiles',
						referencedTableName: 'according_buttons',
						referencedColumnNames: ['_eq'],
						columnNames: ['according_button_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('according_buttons_files');
	}
}
