import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1787412763518 implements MigrationInterface {
    name = 'Migrations1787412763518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "global_category_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eng" character varying NOT NULL, "ukr" character varying NOT NULL, "usedIn" character varying NOT NULL, CONSTRAINT "PK_68974b3a48cdf780e45dbb3ed0a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eng" character varying, "ukr" character varying, "usedIn" character varying NOT NULL, "familyId" uuid, CONSTRAINT "PK_1a38b9007ed8afab85026703a53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" DROP COLUMN "mostSpentOn"`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" DROP COLUMN "mostEarnedFrom"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD "categoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD "globalCategoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" ADD "mostSpentOnId" uuid`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" ADD CONSTRAINT "UQ_c106171169dc5858460a509749a" UNIQUE ("mostSpentOnId")`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" ADD "mostSpentOnGlobalId" uuid`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" ADD CONSTRAINT "UQ_0709aaae88a5cd35daf2f861386" UNIQUE ("mostSpentOnGlobalId")`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" ADD "mostEarnedFromId" uuid`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" ADD CONSTRAINT "UQ_3e69388aa7dfd0dadd2933981ae" UNIQUE ("mostEarnedFromId")`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" ADD "mostEarnedFromGlobalId" uuid`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" ADD CONSTRAINT "UQ_cb1e0374ce7abc3c0e24c8af8fd" UNIQUE ("mostEarnedFromGlobalId")`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_ed44524e7e60f910e6d5f419eee" FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_4a0c3318980c46e6ec26d8fdd4f" FOREIGN KEY ("globalCategoryId") REFERENCES "global_category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_entity" ADD CONSTRAINT "FK_bfa921aa87cfc4b6c0c142850ae" FOREIGN KEY ("familyId") REFERENCES "family_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" ADD CONSTRAINT "FK_c106171169dc5858460a509749a" FOREIGN KEY ("mostSpentOnId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" ADD CONSTRAINT "FK_0709aaae88a5cd35daf2f861386" FOREIGN KEY ("mostSpentOnGlobalId") REFERENCES "global_category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" ADD CONSTRAINT "FK_3e69388aa7dfd0dadd2933981ae" FOREIGN KEY ("mostEarnedFromId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" ADD CONSTRAINT "FK_cb1e0374ce7abc3c0e24c8af8fd" FOREIGN KEY ("mostEarnedFromGlobalId") REFERENCES "global_category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" DROP CONSTRAINT "FK_cb1e0374ce7abc3c0e24c8af8fd"`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" DROP CONSTRAINT "FK_3e69388aa7dfd0dadd2933981ae"`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" DROP CONSTRAINT "FK_0709aaae88a5cd35daf2f861386"`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" DROP CONSTRAINT "FK_c106171169dc5858460a509749a"`);
        await queryRunner.query(`ALTER TABLE "category_entity" DROP CONSTRAINT "FK_bfa921aa87cfc4b6c0c142850ae"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_4a0c3318980c46e6ec26d8fdd4f"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_ed44524e7e60f910e6d5f419eee"`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" DROP CONSTRAINT "UQ_cb1e0374ce7abc3c0e24c8af8fd"`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" DROP COLUMN "mostEarnedFromGlobalId"`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" DROP CONSTRAINT "UQ_3e69388aa7dfd0dadd2933981ae"`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" DROP COLUMN "mostEarnedFromId"`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" DROP CONSTRAINT "UQ_0709aaae88a5cd35daf2f861386"`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" DROP COLUMN "mostSpentOnGlobalId"`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" DROP CONSTRAINT "UQ_c106171169dc5858460a509749a"`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" DROP COLUMN "mostSpentOnId"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP COLUMN "globalCategoryId"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" ADD "mostEarnedFrom" character varying`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" ADD "mostSpentOn" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD "category" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "category_entity"`);
        await queryRunner.query(`DROP TABLE "global_category_entity"`);
    }

}
