import {parsePoint} from "@/src/lib/work-with-data/gis-operations/decode-points";
import {createFrameDBSchema} from "./schemas"
// docs in https://www.prisma.io/docs/orm/prisma-client/queries/raw-database-access/custom-and-type-safe-queries
import {prisma} from "@/src/lib/database/prisma";

export const imagesPrismaClientSql = prisma.$extends({
    model: {
        image: {
            async create(data: createFrameDBSchema) {
                // Create an object using the custom types from above
                const image: createFrameDBSchema = {
                    name: data.name,
                    date: data.date,
                    coordinates: data.coordinates,
                    videoId: data.videoId,
                    url: data.url
                }

                // Insert the object into the database
                const point = `POINT(${image.coordinates.longitude} ${image.coordinates.latitude})`

                await prisma.$queryRaw`
          INSERT INTO "Image" (id, date, coordinates, url, "videoId") VALUES (${image.name}, 
          ${image.date}, ST_GeomFromText(${point}, 4326), ${image.url}, ${image.videoId});
        `

                // Return the object
                return image
            },

            async findByCoordinates(latitude: number, longitude: number) {

                const rawQuery = `
                SELECT
                id,
                    date,
                    ST_AsText(coordinates) as coordinates,
                    url,
                    "dateReceived",
                    classified,
                    "dateClassified"
                FROM
                "Image"
                WHERE
                ST_AsText(coordinates) = ST_AsText(ST_GeomFromText($1, 4326))
                    `;

                const point = `POINT(${longitude} ${latitude})`;

                const images = await prisma.$queryRawUnsafe(rawQuery, point);

                // If you need to parse coordinates
                // @ts-ignore
                return images.map((image: { coordinates: string }) => ({
                    ...image,
                    coordinates: parsePoint(image.coordinates),
                }));
            }
        },
    },
})