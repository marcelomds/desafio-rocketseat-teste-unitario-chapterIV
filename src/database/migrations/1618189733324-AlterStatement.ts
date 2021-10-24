import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AlterStatement1618189733324 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {

      await queryRunner.changeColumn("statements", 'type', new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['deposit', 'withdraw', 'transfer']
      }));

      await queryRunner.addColumn("statements", new TableColumn({
        name: "sender_id",
        type: "uuid",
        isNullable: true,
      }));

      await queryRunner.createForeignKey("statements", new TableForeignKey({
        columnNames: ["sender_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE"
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
