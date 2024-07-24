-- CreateTable
CREATE TABLE "PointOfInterest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" geography(Point, 4326) NOT NULL,

    CONSTRAINT "PointOfInterest_pkey" PRIMARY KEY ("id")
);
