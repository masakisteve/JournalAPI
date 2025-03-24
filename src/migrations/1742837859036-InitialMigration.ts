import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1742837859036 implements MigrationInterface {
    name = 'InitialMigration1742837859036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tags\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`journal_entries\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`mood\` varchar(255) NULL, \`wordCount\` int NOT NULL, \`entryDate\` timestamp NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`categoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_preferences\` (\`id\` int NOT NULL AUTO_INCREMENT, \`theme\` varchar(255) NOT NULL DEFAULT 'light', \`language\` varchar(255) NOT NULL DEFAULT 'en', \`emailNotifications\` tinyint NOT NULL DEFAULT 1, \`userId\` varchar(36) NULL, UNIQUE INDEX \`REL_b6202d1cacc63a0b9c8dac2abd\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`isEmailVerified\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`journals\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`journal_entries_tags_tags\` (\`journalEntriesId\` varchar(36) NOT NULL, \`tagsId\` int NOT NULL, INDEX \`IDX_522e5b3e7df4ae37f22f28ddda\` (\`journalEntriesId\`), INDEX \`IDX_2ddd6ba5f558a8f8a295e2e80e\` (\`tagsId\`), PRIMARY KEY (\`journalEntriesId\`, \`tagsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_roles_roles\` (\`usersId\` varchar(36) NOT NULL, \`rolesId\` int NOT NULL, INDEX \`IDX_df951a64f09865171d2d7a502b\` (\`usersId\`), INDEX \`IDX_b2f0366aa9349789527e0c36d9\` (\`rolesId\`), PRIMARY KEY (\`usersId\`, \`rolesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_13e8b2a21988bec6fdcbb1fa741\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tags\` ADD CONSTRAINT \`FK_92e67dc508c705dd66c94615576\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`journal_entries\` ADD CONSTRAINT \`FK_bf5147ed303e809a150f1f40237\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`journal_entries\` ADD CONSTRAINT \`FK_9c006cf217ba3c453ebee7f3288\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_preferences\` ADD CONSTRAINT \`FK_b6202d1cacc63a0b9c8dac2abd4\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`journal_entries_tags_tags\` ADD CONSTRAINT \`FK_522e5b3e7df4ae37f22f28ddda9\` FOREIGN KEY (\`journalEntriesId\`) REFERENCES \`journal_entries\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`journal_entries_tags_tags\` ADD CONSTRAINT \`FK_2ddd6ba5f558a8f8a295e2e80e7\` FOREIGN KEY (\`tagsId\`) REFERENCES \`tags\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_roles_roles\` ADD CONSTRAINT \`FK_df951a64f09865171d2d7a502b1\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_roles_roles\` ADD CONSTRAINT \`FK_b2f0366aa9349789527e0c36d97\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_roles_roles\` DROP FOREIGN KEY \`FK_b2f0366aa9349789527e0c36d97\``);
        await queryRunner.query(`ALTER TABLE \`users_roles_roles\` DROP FOREIGN KEY \`FK_df951a64f09865171d2d7a502b1\``);
        await queryRunner.query(`ALTER TABLE \`journal_entries_tags_tags\` DROP FOREIGN KEY \`FK_2ddd6ba5f558a8f8a295e2e80e7\``);
        await queryRunner.query(`ALTER TABLE \`journal_entries_tags_tags\` DROP FOREIGN KEY \`FK_522e5b3e7df4ae37f22f28ddda9\``);
        await queryRunner.query(`ALTER TABLE \`user_preferences\` DROP FOREIGN KEY \`FK_b6202d1cacc63a0b9c8dac2abd4\``);
        await queryRunner.query(`ALTER TABLE \`journal_entries\` DROP FOREIGN KEY \`FK_9c006cf217ba3c453ebee7f3288\``);
        await queryRunner.query(`ALTER TABLE \`journal_entries\` DROP FOREIGN KEY \`FK_bf5147ed303e809a150f1f40237\``);
        await queryRunner.query(`ALTER TABLE \`tags\` DROP FOREIGN KEY \`FK_92e67dc508c705dd66c94615576\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_13e8b2a21988bec6fdcbb1fa741\``);
        await queryRunner.query(`DROP INDEX \`IDX_b2f0366aa9349789527e0c36d9\` ON \`users_roles_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_df951a64f09865171d2d7a502b\` ON \`users_roles_roles\``);
        await queryRunner.query(`DROP TABLE \`users_roles_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_2ddd6ba5f558a8f8a295e2e80e\` ON \`journal_entries_tags_tags\``);
        await queryRunner.query(`DROP INDEX \`IDX_522e5b3e7df4ae37f22f28ddda\` ON \`journal_entries_tags_tags\``);
        await queryRunner.query(`DROP TABLE \`journal_entries_tags_tags\``);
        await queryRunner.query(`DROP TABLE \`journals\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_b6202d1cacc63a0b9c8dac2abd\` ON \`user_preferences\``);
        await queryRunner.query(`DROP TABLE \`user_preferences\``);
        await queryRunner.query(`DROP TABLE \`journal_entries\``);
        await queryRunner.query(`DROP TABLE \`tags\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}
