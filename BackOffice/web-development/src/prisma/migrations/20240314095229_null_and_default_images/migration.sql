-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "classified" SET DEFAULT false,
ALTER COLUMN "dateClassified" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "uploadStatus" DROP DEFAULT,
ALTER COLUMN "distanceTravelled" DROP DEFAULT,
ALTER COLUMN "receivedFrames" DROP DEFAULT;
