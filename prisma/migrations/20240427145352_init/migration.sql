/*
  Warnings:

  - You are about to drop the column `updateddAt` on the `post` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `updateddAt`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
