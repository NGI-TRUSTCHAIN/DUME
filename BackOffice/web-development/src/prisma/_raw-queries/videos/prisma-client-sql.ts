// docs in https://www.prisma.io/docs/orm/prisma-client/queries/raw-database-access/custom-and-type-safe-queries
import {prisma} from "@/src/lib/database/prisma";
import {createVideoDBSchema} from "./schemas";
import {calculateDistance} from "@/src/lib/work-with-data/gis-operations/calculate-distance";
import {idSchema, videosPaginatedSchema} from "@/src/server/routes/videos/schemas";
import {z} from "zod";
import {parsePoint} from "@/src/lib/work-with-data/gis-operations/decode-points";

// docs in https://www.prisma.io/docs/orm/prisma-client/queries/raw-database-access/custom-and-type-safe-queries
export const videosPrismaClientSql = prisma.$extends({
    model: {
        video: {
            create: async function (data: createVideoDBSchema) {
                // Create an object using the custom types from above
                const video: createVideoDBSchema = {
                    name: data.name,
                    dateStart: data.dateStart,
                    dateEnd: data.dateEnd,
                    coordinateStart: {
                        latitude: data.coordinateStart.latitude,
                        longitude: data.coordinateStart.longitude
                    },
                    coordinateEnd: {
                        latitude: data.coordinateEnd.latitude,
                        longitude: data.coordinateEnd.longitude
                    },
                    origin: data.origin,
                    username: data.username,
                    totalFrames: data.totalFrames
                }

                console.log(video)

                // Insert the object into the database
                const pointStart = `POINT(${video.coordinateStart.longitude} ${video.coordinateStart.latitude})`
                const pointEnd = `POINT(${video.coordinateEnd.longitude} ${video.coordinateEnd.latitude})`

                const distanceTravelled = calculateDistance(video.coordinateStart, video.coordinateEnd)
                const deviceId = await prisma.device.findUnique({
                    where: {name: video.origin},
                    select: {id: true}
                })

                if (!deviceId)
                    throw new Error('Device id not found.')

                const userId = await prisma.user.findUnique({
                    where: {email: video.username},
                    select: {id: true}
                })

                if (!userId) {
                    throw new Error('User not found.')
                }

                await prisma.$queryRaw`
          INSERT INTO "Video" (id, "dateStart", "dateEnd", "coordinateStart", "coordinateEnd", "totalFrames", "userId", "deviceId" ) VALUES (${video.name}, 
          ${video.dateStart}, ${video.dateEnd}, ST_GeomFromText(${pointStart}, 4326), ST_GeomFromText(${pointEnd}, 4326), ${video.totalFrames}, ${userId!.id}, ${deviceId!.id});
        `

                // Return the object
                return video
            },

            findUniqueVideoMobile: async function (data: z.infer<typeof idSchema>) {
                const video: any = await prisma.$queryRaw
                `SELECT  id, "dateStart", "dateEnd", ST_AsText("coordinateStart") as "coordinateStart", 
                      "uploadStatus", "distanceTravelled", "receivedFrames", "totalFrames", "deviceId"
                     FROM "Video" 
                     WHERE "id" = ${data.videoId}`

                return video.map((video: { coordinateStart: string; }) => ({
                    ...video,
                    coordinateStart: parsePoint(video.coordinateStart)
                }));

            },

            findPaginatedMobile: async function (data: z.infer<typeof videosPaginatedSchema>) {
                let whereClause = `WHERE "userId" = ${data.userId}`;

                // Add date range filter if both dateStart and dateEnd are provided
                if (data.dateStart && data.dateEnd) {
                    whereClause += ` AND "dateStart" BETWEEN '${data.dateStart.toISOString()}' AND '${data.dateEnd.toISOString()}'`;
                }

                if (data.uploadStatus){
                    switch (data.uploadStatus) {
                        case 'uploaded':
                            whereClause += ` AND "uploadStatus" = 100`;
                            break;
                        case 'uploading':
                            whereClause += ` AND "uploadStatus" BETWEEN 0 AND 99`;
                            break;
                        default:
                            // No additional filter for 'all'
                            break;
                    }
                }

                const query = `SELECT  id, "dateStart", "dateEnd", ST_AsText("coordinateStart") as "coordinateStart", 
                      "uploadStatus", "distanceTravelled", "receivedFrames", "totalFrames", "deviceId"
                     FROM "Video" ${whereClause}
                     ORDER BY "dateStart" ${data.orderBy}
                     LIMIT ${data.numberOfRows}
                     OFFSET ${data.startingRow}`;

                const videos: any = await prisma.$queryRawUnsafe(query);

                return videos.map((video: { coordinateStart: string; }) => ({
                    ...video,
                    coordinateStart: parsePoint(video.coordinateStart),
                }));
            },
            getImagesCoordinatesForVideo: async function (data: z.infer<typeof idSchema>) {

                type Coordinates = {
                    coordinates: string;
                    date: Date;
                };

                const videoCoordinates = await prisma.$queryRaw<Coordinates[]>
                    `SELECT date, ST_AsText(coordinates) as coordinates FROM "Image"
                            WHERE "videoId" = ${data.videoId}
                            ORDER BY date ASC`

                return videoCoordinates.map(({coordinates, date}) => ({
                    coordinates: parsePoint(coordinates),
                    date
                }));
            }
        },

    }
})