/*
  Warnings:

  - You are about to drop the column `content` on the `postComment` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `postComment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `postComment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `postComment` DROP COLUMN `content`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- CreateTable
CREATE TABLE `comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `postComment` ADD CONSTRAINT `postComment_attachedToId_fkey` FOREIGN KEY (`attachedToId`) REFERENCES `comment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
