import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1787599642363 implements MigrationInterface {
    name = 'Migrations1787599642363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "family_entity_global_categories_global_category_entity" ("familyEntityId" uuid NOT NULL, "globalCategoryEntityId" uuid NOT NULL, CONSTRAINT "PK_9c517587c251bf719c07713bb84" PRIMARY KEY ("familyEntityId", "globalCategoryEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4fc93d4eef725396c8a5e259b4" ON "family_entity_global_categories_global_category_entity" ("familyEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5a18aa658c9af2d38078dc0dee" ON "family_entity_global_categories_global_category_entity" ("globalCategoryEntityId") `);
        await queryRunner.query(`ALTER TABLE "family_entity_global_categories_global_category_entity" ADD CONSTRAINT "FK_4fc93d4eef725396c8a5e259b48" FOREIGN KEY ("familyEntityId") REFERENCES "family_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "family_entity_global_categories_global_category_entity" ADD CONSTRAINT "FK_5a18aa658c9af2d38078dc0dee1" FOREIGN KEY ("globalCategoryEntityId") REFERENCES "global_category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "family_entity_global_categories_global_category_entity" DROP CONSTRAINT "FK_5a18aa658c9af2d38078dc0dee1"`);
        await queryRunner.query(`ALTER TABLE "family_entity_global_categories_global_category_entity" DROP CONSTRAINT "FK_4fc93d4eef725396c8a5e259b48"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5a18aa658c9af2d38078dc0dee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4fc93d4eef725396c8a5e259b4"`);
        await queryRunner.query(`DROP TABLE "family_entity_global_categories_global_category_entity"`);
    }

}
