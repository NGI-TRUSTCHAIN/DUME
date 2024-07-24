import {z} from "zod";
import {coordinatesSchema} from "@/src/lib/work-with-data/zod-validators";
import {Prisma} from "@prisma/client";


export const videoSchema = z.object({
    videoId: z.string(),
    dateStart: z.string(),
    dateEnd: z.string(),
    coordinatesStart: coordinatesSchema,
    coordinatesEnd: coordinatesSchema,
    origin: z.string(),
    userEmail: z.string().email(),
    totalFrames: z.number().gte(0)
})

export const videoIdSchema = z.object({
    videoId: z.string(),
    userEmail: z.string().email(),

})

export const idSchema = z.object({
    videoId: z.string().uuid()
})

export const totalFrameSchema = idSchema.extend({
    totalFrames: z.number()
})

export const videosPaginatedSchema = z.object({
    numberOfRows: z.number().gt(0),
    startingRow: z.number().gte(0),
    userId: z.number(),
    orderBy: z.nativeEnum(Prisma.SortOrder),
    dateStart: z.date().optional(),
    dateEnd: z.date().optional(),
    uploadStatus: z.enum(['uploaded', 'uploading', 'all']).optional()
})

export const limitDatesSchema = z.object({
    userId: z.number()
})