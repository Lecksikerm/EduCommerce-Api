import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1761648034528 implements MigrationInterface {
    name = 'InitialSchema1761648034528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "matricNo" character varying, "password" character varying NOT NULL, CONSTRAINT "UQ_25985d58c714a4a427ced57507b" UNIQUE ("email"), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "password" character varying(255) NOT NULL, "email" character varying(150) NOT NULL, "role" character varying NOT NULL DEFAULT 'admin', "isVerified" boolean NOT NULL DEFAULT false, "invitedBy" uuid, CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin_invitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying NOT NULL, "name" character varying NOT NULL, "otp" character varying NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_3648cb96bcc04ac5cbb7ca84c22" UNIQUE ("email"), CONSTRAINT "PK_0c710b9106ea89847bcf62bd3e1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "admin_invitations"`);
        await queryRunner.query(`DROP TABLE "admins"`);
        await queryRunner.query(`DROP TABLE "students"`);
    }

}
