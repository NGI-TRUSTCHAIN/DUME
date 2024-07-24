-- DropForeignKey
ALTER TABLE "Occurrence" DROP CONSTRAINT "Occurrence_imageId_fkey";

-- AddForeignKey
ALTER TABLE "Occurrence" ADD CONSTRAINT "Occurrence_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
