import {z} from "zod";
import {zfd} from "zod-form-data";
import {imageValidator} from "@/src/lib/work-with-data/zod-validators";

export const userEmailSchema = z.object({
    email: z.string().email(),
})

export const userCredentialsSchema  = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string().optional()
});

export const userResetPasswordSchema = z.object({
    tokenId: z.number().gt(0),
    password: z.string(),
})

export const userUpdateNameSchema = z.object({
    name: z.string(),
    email: z.string().email(),
})

export const userUpdateEmailSchema = z.object({
    oldEmail: z.string().email(),
    newEmail: z.string().email()
})

export const userUpdateProfilePictureSchema = zfd.formData({
    email: zfd.text(),
    image: imageValidator
})

export const userIdSchema = z.object({
    id: z.number().gt(0)
})