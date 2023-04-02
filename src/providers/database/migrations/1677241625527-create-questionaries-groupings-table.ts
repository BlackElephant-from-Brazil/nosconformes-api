import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateQuestionariesGroupingsTable1677241625527
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'questionaries_groupings',
				columns: [
					{
						name: 'questionary_id',
						type: 'uuid',
					},
					{
						name: 'grouping_id',
						type: 'uuid',
					},
				],
				foreignKeys: [
					{
						name: 'QuestionaryQuestionariesGroupings',
						referencedTableName: 'questionaries',
						referencedColumnNames: ['_eq'],
						columnNames: ['questionary_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
					{
						name: 'GroupingQuestionariesGroupings',
						referencedTableName: 'groupings',
						referencedColumnNames: ['_eq'],
						columnNames: ['grouping_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('questionaries_groupings');
	}
}
