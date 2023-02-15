import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1672782049384 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
		await queryRunner.createTable(
			new Table({
				name: 'users',
				columns: [
					{
						name: '_eq',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'profile_picture',
						type: 'varchar',
					},
					{
						name: 'name',
						type: 'varchar',
					},
					{
						name: 'email',
						type: 'varchar',
						isUnique: true,
					},
					{
						name: 'password',
						type: 'varchar',
					},
					{
						name: 'phone',
						type: 'varchar',
						length: '11',
					},
					{
						name: 'office',
						type: 'varchar',
					},
					{
						name: 'access_level',
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
		await queryRunner.dropTable('users');
	}
}
