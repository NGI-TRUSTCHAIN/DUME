/*
  Warnings:

  - Added the required column `deviceId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Devices" AS ENUM ('MOBILE', 'COMPANION');

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "deviceId" INTEGER NOT NULL,
ALTER COLUMN "uploadStatus" SET DEFAULT 0,
ALTER COLUMN "dateEndTransmission" DROP NOT NULL,
ALTER COLUMN "distanceTravelled" SET DEFAULT 0,
ALTER COLUMN "receivedFrames" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "name" "Devices" NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
