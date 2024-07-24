import {zfd} from "zod-form-data";
import {z} from "zod";
import { isValidMetadata } from "../validate-schema-metadata";

const ACCEPTED_VIDEO_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
];


export const uniqueVideoValidator = zfd.file()
    .refine((files) => files?.size !== 1, {message: 'Image is required.'})
    .refine(
        (file) => ACCEPTED_VIDEO_MIME_TYPES.includes(file?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported.")

export const multipleVideosValidator = z.array(uniqueVideoValidator)


// const videoValidator = z.string().refine((metadata) => {
//     try {
//         const parsedMetadata = JSON.parse(metadata)
//         return typeof parsedMetadata === "object" && parsedMetadata !== null &&
//             "id" in parsedMetadata &&
//             "dateStart" in parsedMetadata &&
//             "dateEnd" in parsedMetadata;
//     }catch (error){
//         return false;
//     }
// })
// Define the expected keys


// export const videosShema = zfd.formData({
//     videos: z.array(videoValidator)
// })