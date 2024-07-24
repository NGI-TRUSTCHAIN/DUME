import {z} from "zod";

export const userResetPasswordSchema = z.object({
    tokenId: z.number().gt(0),
})

export const UserTokenSchema = z.object({
    userId: z.number().gt(0),
})