/*
  Warnings:

  - You are about to drop the `Meta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PointOfInterest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Meta";

-- DropTable
DROP TABLE "PointOfInterest";

-- RenameIndex
ALTER INDEX "imageLocation_idx" RENAME TO "imageCoordinates";

-- RenameIndex
ALTER INDEX "videoLocation_idx" RENAME TO "videoCoordinates";
