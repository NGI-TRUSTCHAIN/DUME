/*
  Warnings:

  - You are about to drop the column `name` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "name";
