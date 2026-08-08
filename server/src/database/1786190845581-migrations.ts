import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1786190845581 implements MigrationInterface {
    name = 'Migrations1786190845581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_d8375e0b2592310864d2b4974b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "family_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "ownerId" uuid, "avatarId" uuid, "bannerId" uuid, CONSTRAINT "REL_d844772ca8e578ea77e0084c94" UNIQUE ("ownerId"), CONSTRAINT "REL_12b231c57c37ce9bef6bbbfc5f" UNIQUE ("avatarId"), CONSTRAINT "REL_f3769c56ad6da36e6e3b4a1829" UNIQUE ("bannerId"), CONSTRAINT "PK_65c31003cf5a37e9913a3910dfe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "meta" text, "icon" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_112676de71a3a708b914daed289" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "telegram_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "telegramUsername" character varying NOT NULL, "telegramId" bigint NOT NULL, "chatId" bigint NOT NULL, "lang" character varying NOT NULL, "expiresAt" date NOT NULL, "userId" uuid, CONSTRAINT "PK_cfc62e597b9eb3e905de66b1a54" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying, "roles" character varying NOT NULL DEFAULT '["user"]', "googleId" character varying, "telegramId" bigint, "familyId" uuid, "familyOwnedId" uuid, "requestingToJoinFamilyId" uuid, "avatarId" uuid, CONSTRAINT "UQ_fe20cfab609d81ede76a2f349c2" UNIQUE ("telegramId"), CONSTRAINT "REL_9988efe7fa1a679169473e6833" UNIQUE ("familyOwnedId"), CONSTRAINT "REL_b8ff7c4949e12585b6ba48ec67" UNIQUE ("avatarId"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_entity" ("id" SERIAL NOT NULL, "familyId" uuid NOT NULL, "amount" integer NOT NULL, "category" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "comment" character varying, "userId" uuid, CONSTRAINT "PK_6f9d7f02d8835ac9ef1f685a2e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "monthly_summary_entity" ("id" SERIAL NOT NULL, "month" integer NOT NULL, "year" integer NOT NULL, "totalSpent" integer NOT NULL, "totalEarned" integer NOT NULL, "pnl" integer NOT NULL, "mostSpentOn" character varying, "mostEarnedFrom" character varying, "familyId" uuid, "topSpenderId" uuid, "topEarnerId" uuid, CONSTRAINT "PK_ce9cfb08a665661837fb7a1f3e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "one_time_password_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password" character varying NOT NULL, "userId" uuid, "expiresAt" date NOT NULL, CONSTRAINT "UQ_763322dd2338efd11c78977ed40" UNIQUE ("password"), CONSTRAINT "PK_35715078c818d3cc7f39569b8a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "family_entity" ADD CONSTRAINT "FK_d844772ca8e578ea77e0084c94a" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "family_entity" ADD CONSTRAINT "FK_12b231c57c37ce9bef6bbbfc5fd" FOREIGN KEY ("avatarId") REFERENCES "file_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "family_entity" ADD CONSTRAINT "FK_f3769c56ad6da36e6e3b4a1829e" FOREIGN KEY ("bannerId") REFERENCES "file_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_entity" ADD CONSTRAINT "FK_dd9edd17abec9f32798a1f1e22d" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "telegram_entity" ADD CONSTRAINT "FK_59c7a1b35b93ca6678078075dec" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_e1565bc2a6eec863c8ce5a1c563" FOREIGN KEY ("familyId") REFERENCES "family_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_9988efe7fa1a679169473e6833a" FOREIGN KEY ("familyOwnedId") REFERENCES "family_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_b5650c13729c71f7be01ae9d6b7" FOREIGN KEY ("requestingToJoinFamilyId") REFERENCES "family_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_b8ff7c4949e12585b6ba48ec676" FOREIGN KEY ("avatarId") REFERENCES "file_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_d6703c8f1c01fde6ed20abb26eb" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" ADD CONSTRAINT "FK_1525e5194f93ef9cac9b4d12918" FOREIGN KEY ("familyId") REFERENCES "family_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" ADD CONSTRAINT "FK_ffc23a2851fa0f592881a8e0cc2" FOREIGN KEY ("topSpenderId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" ADD CONSTRAINT "FK_3d2f524ef293acb028e0c8c312c" FOREIGN KEY ("topEarnerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" DROP CONSTRAINT "FK_3d2f524ef293acb028e0c8c312c"`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" DROP CONSTRAINT "FK_ffc23a2851fa0f592881a8e0cc2"`);
        await queryRunner.query(`ALTER TABLE "monthly_summary_entity" DROP CONSTRAINT "FK_1525e5194f93ef9cac9b4d12918"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_d6703c8f1c01fde6ed20abb26eb"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_b8ff7c4949e12585b6ba48ec676"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_b5650c13729c71f7be01ae9d6b7"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_9988efe7fa1a679169473e6833a"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_e1565bc2a6eec863c8ce5a1c563"`);
        await queryRunner.query(`ALTER TABLE "telegram_entity" DROP CONSTRAINT "FK_59c7a1b35b93ca6678078075dec"`);
        await queryRunner.query(`ALTER TABLE "notification_entity" DROP CONSTRAINT "FK_dd9edd17abec9f32798a1f1e22d"`);
        await queryRunner.query(`ALTER TABLE "family_entity" DROP CONSTRAINT "FK_f3769c56ad6da36e6e3b4a1829e"`);
        await queryRunner.query(`ALTER TABLE "family_entity" DROP CONSTRAINT "FK_12b231c57c37ce9bef6bbbfc5fd"`);
        await queryRunner.query(`ALTER TABLE "family_entity" DROP CONSTRAINT "FK_d844772ca8e578ea77e0084c94a"`);
        await queryRunner.query(`DROP TABLE "one_time_password_entity"`);
        await queryRunner.query(`DROP TABLE "monthly_summary_entity"`);
        await queryRunner.query(`DROP TABLE "transaction_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "telegram_entity"`);
        await queryRunner.query(`DROP TABLE "notification_entity"`);
        await queryRunner.query(`DROP TABLE "family_entity"`);
        await queryRunner.query(`DROP TABLE "file_entity"`);
    }

}
