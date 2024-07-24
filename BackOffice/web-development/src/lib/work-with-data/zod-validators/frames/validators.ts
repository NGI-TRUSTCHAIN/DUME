import {zfd} from "zod-form-data";
import {z} from "zod";
import {imageValidator} from "@/src/lib/work-with-data/zod-validators";


// const frameValidator = zfd.formData({
//     image: imageSchema,
//     id: zfd.text(z.string()),
//     date: zfd.text(),
//     annotations: zfd.text(),
//     coordinates: singleCoordinatesSchema
// })


// const expectedKeys = ['frameId', 'date', 'coordinates', 'videoId', 'userEmail']
// const frameValidator = z.string().refine((metadata) => {
//     try {
//         console.log(metadata)
//         const parsedMetadata = JSON.parse(metadata);
//         return isValidMetadata(expectedKeys, parsedMetadata);
//     } catch (error) {
//         console.error(error)
//         return false;
//     }
// }, {message: "Invalid metadata. Only expected keys are allowed."});

const frameValidator = z.string(
    z.object({
        frameId: z.string(),
        date: z.string(),
        coordinates:z.string(),
        videoId: z.string(),
    })
)


export const frameSchema = zfd.formData({
    frameMetadata: frameValidator.or(z.array(frameValidator)),
    frame: imageValidator.optional(),
    frames: z.array(imageValidator).optional(),
    test: z.object({
        test:z.string()
    }).optional()
})
    .refine((video) => (video.frames && !video.frame) || (!video.frames && video.frame), {
        message: "Only image or images can be sent. Not Both",
        path: ['frame', 'frames']
    })
    .refine(video => {
        const {frameMetadata, frame, frames} = video;

        let parsedMetadata
        if (typeof frameMetadata === "string")
            parsedMetadata = JSON.parse(frameMetadata)

        if (frame)
            return !Array.isArray(frameMetadata)

        if (frames)
            return Array.isArray(parsedMetadata) && parsedMetadata.length === frames!.length

        return false
    }, {
        message: "Invalid combination of frameMetadata and frames.",
        path: ['frameMetadata', 'frames']
    })

