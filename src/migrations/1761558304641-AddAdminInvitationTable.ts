import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminInvitationTable1761558304641 implements MigrationInterface {
    name = 'AddAdminInvitationTable1761558304641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin_invitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying NOT NULL, "name" character varying NOT NULL, "otp" character varying NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_3648cb96bcc04ac5cbb7ca84c22" UNIQUE ("email"), CONSTRAINT "PK_0c710b9106ea89847bcf62bd3e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "admins" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "admins" ADD "role" character varying NOT NULL DEFAULT 'admin'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "admins" ADD "role" character varying(50) DEFAULT 'admin'`);
        await queryRunner.query(`DROP TABLE "admin_invitations"`);
    }

}
