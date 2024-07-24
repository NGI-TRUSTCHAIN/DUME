-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "distanceTravelled" DROP NOT NULL,
ALTER COLUMN "receivedFrames" SET DEFAULT 0;
