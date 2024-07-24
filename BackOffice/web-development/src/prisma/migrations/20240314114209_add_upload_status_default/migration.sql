/*
  Warnings:

  - Made the column `distanceTravelled` on table `Video` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "uploadStatus" SET DEFAULT 0,
ALTER COLUMN "distanceTravelled" SET NOT NULL,
ALTER COLUMN "distanceTravelled" SET DEFAULT 0;
