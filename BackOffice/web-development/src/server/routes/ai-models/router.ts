import { prisma } from "@/src/lib/database/prisma";
import {protectedProcedure, publicProcedure, router} from "@/src/server/trpc";
import {classSchema} from "@/src/server/routes/ai-models/schemas";
// import { deviceSchema } from "./schemas";


const AIModelsRouter = router({
    // createDevice: protectedProcedure.input(deviceSchema).mutation(
    //     async ({ input }) =>  {
    //         return prisma.device.create({
    //             data: {
    //                 name: input.name,
    //             }
    //         })
    //     },
    // )

    createClasses: publicProcedure
        .input(classSchema)
        .mutation(async ({ input }) => {

            return prisma.class.create({
                data: {
                    name: input.name,
                }
            })
        })


});

export default AIModelsRouter;