import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateQuestionsReferencesTable1679263750300
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'questions_references',
				columns: [
					{
						name: 'question_id',
						type: 'uuid',
					},
					{
						name: 'reference_id',
						type: 'uuid',
					},
				],
				foreignKeys: [
					{
						name: 'QuestionQuestionsReferences',
						referencedTableName: 'questions',
						referencedColumnNames: ['_eq'],
						columnNames: ['question_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
					{
						name: 'ReferenceQuestionsReferences',
						referencedTableName: 'references',
						referencedColumnNames: ['_eq'],
						columnNames: ['reference_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('questions_references');
	}
}
