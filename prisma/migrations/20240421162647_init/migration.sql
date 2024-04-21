/*
  Warnings:

  - Added the required column `associationId` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `associationId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_associationId_fkey` FOREIGN KEY (`associationId`) REFERENCES `associations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
