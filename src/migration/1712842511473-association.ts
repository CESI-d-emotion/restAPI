import { MigrationInterface, QueryRunner } from 'typeorm'

export class Association1712842511473 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      ` 
          CREATE TABLE IF NOT EXISTS associations  (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            rna VARCHAR(80) NOT NULL,
            name VARCHAR(50) NOT NULL,
            description VARCHAR(120) NOT NULL,
            createdAt TIMESTAMP NOT NULL,
            updatedAt TIMESTAMP NOT NULL
          )
          `,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE associations`, undefined)
  }
}
