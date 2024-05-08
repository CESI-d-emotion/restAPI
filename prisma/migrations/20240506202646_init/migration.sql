/*
  Warnings:

  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `postComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `typeObjetComment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `postComment` DROP FOREIGN KEY `postComment_attachedToId_fkey`;

-- DropForeignKey
ALTER TABLE `postComment` DROP FOREIGN KEY `postComment_postId_fkey`;

-- DropForeignKey
ALTER TABLE `postComment` DROP FOREIGN KEY `postComment_typeObjectId_fkey`;

-- DropForeignKey
ALTER TABLE `postComment` DROP FOREIGN KEY `postComment_userId_fkey`;

-- DropTable
DROP TABLE `comment`;

-- DropTable
DROP TABLE `postComment`;

-- DropTable
DROP TABLE `typeObjetComment`;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,
    `postId` INTEGER NOT NULL,
    `parentId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
