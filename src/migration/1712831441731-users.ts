import { MigrationInterface, QueryRunner } from 'typeorm'

export class Users1712831441731 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      ` 
          CREATE TABLE IF NOT EXISTS users  (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            firstName VARCHAR(50) NOT NULL,
            lastName VARCHAR(50) NOT NULL,
            age INT NOT NULL
          )
          `,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users`, undefined)
  }
}
