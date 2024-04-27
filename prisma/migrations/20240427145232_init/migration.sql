/*
  Warnings:

  - You are about to drop the column `updateAt` on the `post` table. All the data in the column will be lost.
  - Added the required column `updateddAt` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `updateAt`,
    ADD COLUMN `updateddAt` DATETIME(3) NOT NULL;
