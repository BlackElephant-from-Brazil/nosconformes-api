import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateQuestionsTagsTable1679263764399
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'questions_tags',
				columns: [
					{
						name: 'question_id',
						type: 'uuid',
					},
					{
						name: 'tag_id',
						type: 'uuid',
					},
				],
				foreignKeys: [
					{
						name: 'QuestionQuestionsTags',
						referencedTableName: 'questions',
						referencedColumnNames: ['_eq'],
						columnNames: ['question_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
					{
						name: 'TagQuestionsReferences',
						referencedTableName: 'tags',
						referencedColumnNames: ['_eq'],
						columnNames: ['tag_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('questions_tags');
	}
}
