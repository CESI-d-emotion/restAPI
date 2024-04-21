/*
  Warnings:

  - Added the required column `password` to the `associations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `associations` ADD COLUMN `password` VARCHAR(100) NOT NULL;
