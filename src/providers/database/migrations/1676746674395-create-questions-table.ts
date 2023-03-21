import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateQuestionsTable1676746674395 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'questions',
				columns: [
					{
						name: '_eq',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'id',
						type: 'varchar',
					},
					{
						name: 'question',
						type: 'varchar',
					},
					{
						name: 'func',
						type: 'varchar',
					},
					{
						name: 'threat',
						type: 'varchar',
					},
					{
						name: 'recommendation',
						type: 'varchar',
					},
					{
						name: 'description',
						type: 'varchar',
					},
					{
						name: 'priority',
						type: 'smallint',
					},
					{
						name: 'probability',
						type: 'smallint',
					},
					{
						name: 'impact',
						type: 'smallint',
					},
					{
						name: 'partial_according_allow_information',
						type: 'boolean',
					},
					{
						name: 'non_according_allow_information',
						type: 'boolean',
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
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('questions');
	}
}
