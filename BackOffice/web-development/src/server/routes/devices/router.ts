import { prisma } from "@/src/lib/database/prisma";
import {protectedProcedure, router} from "@/src/server/trpc";
import { deviceSchema } from "./schemas";


const devicesRouter = router({
    createDevice: protectedProcedure.input(deviceSchema).mutation(
        async ({ input }) =>  {
            return prisma.device.create({
                data: {
                    name: input.name,
                }
            })
        },
    )


});

export default devicesRouter;