import {protectedProcedure, router} from "@/src/server/trpc";
import {imageSchema} from "./schemas";
import {createFrameDBSchema} from "@/src/prisma/_raw-queries/images/schemas";
import {imagesPrismaClientSql} from "@/src/prisma/_raw-queries/images/prisma-client-sql";
import {prisma} from "@/src/lib/database/prisma";
import {TRPCError} from "@trpc/server";

const imagesRouter = router({

    addImage: protectedProcedure
        .input(imageSchema)
        .mutation(
        async ({ input }) =>  {
            // Logic to create a new todo
            try {
                const dbSchema: createFrameDBSchema = {
                    name:input.frameId,
                    date: new Date(input.date),
                    coordinates: input.coordinates,
                    videoId: input.videoId,
                    url: input.url!
                }

                // const existentVideo = await prisma.image.findUnique({
                //     where:
                //         {
                //             id: input.frameId
                //         }
                // })
                //
                // if (existentVideo) {
                //     throw new TRPCError({
                //         code: 'CONFLICT',
                //         message: 'Frame already exists in database'
                //     })
                // }
                const res =  await imagesPrismaClientSql.image.create(dbSchema)

                if (!res) {
                    return null
                }

                return {'message': true}
            } catch (cause) {
                console.log(cause)
                return null
            }

        }
    )
});

export default imagesRouter;