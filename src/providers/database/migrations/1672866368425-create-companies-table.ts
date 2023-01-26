import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCompaniesTable1672866368425 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'companies',
				columns: [
					{
						name: '_eq',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'logo',
						type: 'varchar',
					},
					{
						name: 'name',
						type: 'varchar',
					},
					{
						name: 'cnpj',
						type: 'varchar',
					},
					{
						name: 'site',
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
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('companies');
	}
}
