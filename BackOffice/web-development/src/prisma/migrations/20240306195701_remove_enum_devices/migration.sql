/*
  Warnings:

  - Changed the type of `name` on the `Device` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Device" DROP COLUMN "name",
ADD COLUMN     "name" VARCHAR(15) NOT NULL;

-- DropEnum
DROP TYPE "Devices";
