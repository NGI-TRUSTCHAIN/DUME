import {z} from "zod";
import {coordinatesSchema} from "@/src/lib/work-with-data/zod-validators";

// export const videoValidationSchema = videoSchema
//     .and(frameSchema)
//     .and(coordinatesSchema)

// const expectedKeys = ["id", "dateStart", "dateEnd", "totalFrames"];
//
// const videoValidator = z.string().refine((metadata) => {
//     try {
//         const parsedMetadata = JSON.parse(metadata);
//         return isValidMetadata(expectedKeys,parsedMetadata);
//     } catch (error) {
//         return false;
//     }
// }, {message: "Invalid metadata. Only expected keys are allowed."});

export const imageSchema = z.object({
    frameId: z.string(),
    date: z.string(),
    coordinates: coordinatesSchema,
    videoId: z.string(),
    url: z.string().optional(),
})

export type imageSchemaType = z.infer<typeof imageSchema>