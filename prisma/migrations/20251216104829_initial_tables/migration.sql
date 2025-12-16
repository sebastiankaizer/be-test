-- CreateTable
CREATE TABLE `FileProcess` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NULL,
    `sourceUrl` VARCHAR(191) NULL,
    `storagePath` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `errorMessage` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FileProcess_userId_idx`(`userId`),
    INDEX `FileProcess_status_idx`(`status`),
    INDEX `FileProcess_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `fileId` VARCHAR(191) NOT NULL,
    `rowNumber` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NULL,
    `price` DECIMAL(18, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Product_fileId_idx`(`fileId`),
    UNIQUE INDEX `Product_fileId_rowNumber_key`(`fileId`, `rowNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `FileProcess`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
