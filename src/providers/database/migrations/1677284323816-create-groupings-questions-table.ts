import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateGroupingsQuestionsTable1677284323816
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'groupings_questions',
				columns: [
					{
						name: 'grouping_id',
						type: 'uuid',
					},
					{
						name: 'questions_id',
						type: 'uuid',
					},
				],
				foreignKeys: [
					{
						name: 'GroupingGroupingsQuestions',
						referencedTableName: 'groupings',
						referencedColumnNames: ['_eq'],
						columnNames: ['grouping_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
					{
						name: 'QuestionGroupingsQuestions',
						referencedTableName: 'questions',
						referencedColumnNames: ['_eq'],
						columnNames: ['questions_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('groupings_questions');
	}
}
