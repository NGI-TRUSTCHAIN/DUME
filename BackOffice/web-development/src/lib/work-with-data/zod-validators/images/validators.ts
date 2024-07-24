import {zfd} from "zod-form-data";
import {z} from "zod";

const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/octet-stream"
];

export const imageValidator = zfd.file()
    .refine((files) => files?.size >= 1, {message: 'Image is required.'})
    .refine(
        (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
        "Only .yuv, .jpg, .jpeg, .png and .webp formats are supported.")
    .refine(
        (file) => {
            console.log(file.type)
            const extension = file?.name?.split('.').pop()?.toLowerCase();
            return !(file?.type === "application/octet-stream" && extension !== "yuv");

        },
        { message: "Only .yuv files are supported for application/octet-stream MIME type." }
    );

// const multipleImagesValidator = z.array(uniqueImageValidator)

// export const imageSchema = zfd.formData({
//     image: uniqueImageValidator,
// })
//     // .refine((video) => !video.images || !video.image, {
//     //     message: "At least one of 'image' or 'images' is required.",
//     //     path: ['image', 'images']
//     // })
//
// export const imagesSchema = zfd.formData({
//     images: multipleImagesValidator
// })
