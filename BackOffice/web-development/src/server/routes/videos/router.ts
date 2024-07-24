import {protectedProcedure, publicProcedure, router} from "@/src/server/trpc";
import {
    idSchema,
    limitDatesSchema,
    totalFrameSchema,
    videoIdSchema,
    videoSchema,
    videosPaginatedSchema
} from "./schemas";
import {createVideoDBSchema} from "@/src/prisma/_raw-queries/videos/schemas";
import {videosPrismaClientSql} from "@/src/prisma/_raw-queries/videos/prisma-client-sql";
import {prisma} from "@/src/lib/database/prisma";
import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import {calculateUpload} from "@/src/utils/math-operations"
import {userEmailSchema} from "@/src/server/routes/users/schemas";
import {parsePoint} from "@/src/lib/work-with-data/gis-operations/decode-points";
import {TRPCError} from "@trpc/server";


const videosRouter = router({

    addVideo: protectedProcedure
        .input(videoSchema)
        .mutation(
            async ({input}) => {
                // Logic to create a new todo

                const dbSchema: createVideoDBSchema = {
                    name: input.videoId,
                    dateStart: new Date(input.dateStart),
                    dateEnd: new Date(input.dateEnd),
                    coordinateStart: input.coordinatesStart,
                    coordinateEnd: input.coordinatesEnd,
                    origin: input.origin,
                    username: input.userEmail,
                    totalFrames: input.totalFrames
                }

                const existentVideo = await prisma.video.findUnique({
                    where:
                        {
                            id: input.videoId
                        }
                })

                if (existentVideo) {
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: 'Video already exists in database'
                    })
                }

                const res = await videosPrismaClientSql.video.create(dbSchema)

                if (res) {
                    return {'message': true}
                }

                throw new Error('Cannot save video')
            }
        ),

    getTotalFrames: publicProcedure
        .input(idSchema)
        .query(
            async ({input}) => {
                return prisma.video.findFirst({
                    where: {
                        id: input.videoId
                    },
                    select: {
                        totalFrames: true
                    }
                });
            }),

    getReceivedFrames: publicProcedure
        .input(idSchema)
        .query(
            async ({input}) => {
                return prisma.video.findFirst({
                    where: {
                        id: input.videoId
                    },
                    select: {
                        receivedFrames: true
                    }
                });
            }),

    getUploadStatus: publicProcedure
        .input(idSchema)
        .query(
            async ({input}) => {
                return prisma.video.findFirst({
                    where: {
                        id: input.videoId,
                    },
                    select: {
                        uploadStatus: true
                    }
                });
            }
        ),

    updateReceivedFrames: publicProcedure
        .input(totalFrameSchema)
        .mutation(
            async ({input}) => {

                const receivedFrames: any = await trpcServerClient.getReceivedFrames({
                    videoId: input.videoId
                })

                const updatedFramesValue = receivedFrames!.receivedFrames + input.totalFrames

                const updateFrames = prisma.video.update({
                        where: {
                            id: input.videoId
                        },
                        data: {
                            receivedFrames: updatedFramesValue

                        }
                    }
                )

                const currentUpload: any = await trpcServerClient.getTotalFrames({videoId: input.videoId})

                const updatedUpload = calculateUpload(updatedFramesValue, currentUpload!.totalFrames)
                console.log(updatedUpload)

                const updateUpload = prisma.video.update({
                    where: {
                        id: input.videoId
                    },
                    data: {
                        uploadStatus: updatedUpload

                    }
                })

                return prisma.$transaction([updateFrames, updateUpload])
            }
        ),

    getVideoById: protectedProcedure
        .input(idSchema)
        .query(async ({input}) => {

            return videosPrismaClientSql.video.findUniqueVideoMobile(input);
        }),

    getPaginatedVideos: protectedProcedure
        .input(videosPaginatedSchema)
        .query(async ({input}) => {
            return videosPrismaClientSql.video.findPaginatedMobile(input)
        }),

    deleteVideo: protectedProcedure
        .input(idSchema)
        .mutation(async ({input}) => {
            return prisma.video.delete({
                where: {
                    id: input.videoId
                }
            })
        }),

    getVideosLimitsDate: protectedProcedure
        .input(limitDatesSchema)
        .query(async ({input}) => {
            const oldestVideo = await prisma.video.findFirst({
                where: {userId: input.userId},
                orderBy: {dateStart: 'asc'},
                select: {dateStart: true},
            });

            const newestVideo = await prisma.video.findFirst({
                where: {userId: input.userId},
                orderBy: {dateStart: 'desc'},
                select: {dateStart: true},
            });

            return {
                oldestDate: oldestVideo?.dateStart || null,
                newestDate: newestVideo?.dateStart || null,
            };
        }),

    getFramesFromVideo: protectedProcedure
        .input(idSchema)
        .query(async ({input}) => {
            return prisma.video.findFirst({
                where: {id: input.videoId},
                select: {
                    images: {
                        select: {
                            id: true,
                            date: true,
                            url: true,
                            classified: true
                        },
                        orderBy: {
                            date: 'asc'
                        }
                    }
                }
            })
        }),

    getRouteTravelledFromVideo: protectedProcedure
        .input(idSchema)
        .query(async ({input}) => {
            return videosPrismaClientSql.video.getImagesCoordinatesForVideo(input)
        })
})

export default videosRouter;