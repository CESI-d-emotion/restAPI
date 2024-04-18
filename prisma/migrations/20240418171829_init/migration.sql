-- CreateTable
CREATE TABLE `postComment` (
    `userId` INTEGER NOT NULL,
    `postId` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `attachedToId` INTEGER NOT NULL,
    `typeObjectId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `postId`, `typeObjectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `typeObjetComment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `postComment` ADD CONSTRAINT `postComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postComment` ADD CONSTRAINT `postComment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postComment` ADD CONSTRAINT `postComment_typeObjectId_fkey` FOREIGN KEY (`typeObjectId`) REFERENCES `typeObjetComment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
