import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1787506442335 implements MigrationInterface {
    name = 'Migrations1787506442335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_4a0c3318980c46e6ec26d8fdd4f"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_ed44524e7e60f910e6d5f419eee"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_ed44524e7e60f910e6d5f419eee" FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_4a0c3318980c46e6ec26d8fdd4f" FOREIGN KEY ("globalCategoryId") REFERENCES "global_category_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_4a0c3318980c46e6ec26d8fdd4f"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_ed44524e7e60f910e6d5f419eee"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_ed44524e7e60f910e6d5f419eee" FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_4a0c3318980c46e6ec26d8fdd4f" FOREIGN KEY ("globalCategoryId") REFERENCES "global_category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
