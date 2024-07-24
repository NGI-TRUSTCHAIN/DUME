import {hash} from "bcrypt";
import {protectedProcedure, publicProcedure, router} from "@/src/server/trpc";
import {
    userCredentialsSchema,
    userEmailSchema, userIdSchema,
    userResetPasswordSchema,
    userUpdateEmailSchema,
    userUpdateNameSchema, userUpdateProfilePictureSchema
} from "./schemas";
import {prisma} from "@/src/lib/database/prisma";
import {saveFile} from "@/src/lib/work-with-data/file-operations/save";
import {generateToken} from "@/src/lib/auth/generate-token-account";
import {TRPCError} from "@trpc/server";

const userRouter = router({
    createUser: publicProcedure
        .input(userCredentialsSchema)
        .mutation(async ({input}) => {

            const existentUser =  await prisma.user.findUnique({
                where: {
                    email: input.email
                }
            })

            if (existentUser) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'User already exists in database'
                })
            }

            const hashed = await hash(input.password, 12)

            return prisma.user.create({
                data: {
                    email: input.email,
                    password: hashed,
                    // Add the username only if it's defined
                    ...(input.name && {name: input.name}),
                },
            });
        }),

    createTokenAccount: publicProcedure
        .input(userIdSchema)
        .mutation(async ({input}) => {

            return prisma.activateToken.create({
                data:
                    {
                        userId:input.id,
                        token: generateToken()
                    }
            })
        }),

    getUser: publicProcedure
        .input(userEmailSchema)
        .query(async ({input}) => {
            return prisma.user.findUnique({
                where: {
                    email: input.email
                },
            });
        }),

    resetUserPassword: protectedProcedure
        .input(userResetPasswordSchema)
        .mutation(async ({input}) => {
            return prisma.user.update({
                where: {id: input.tokenId},
                data: {
                    password: input.password,
                },
            });
        }),

    deleteUser: protectedProcedure
        .input(userEmailSchema)
        .mutation(async ({input}) => {
            return prisma.user.delete({
                where: {
                    email: input.email
                }
            })
        }),

    updateUserName: protectedProcedure
        .input(userUpdateNameSchema)
        .mutation(async ({input}) => {
            return prisma.user.update({
                where: {email: input.email},
                data: {name: input.name}
            })
        }),

    updateUserEmail: protectedProcedure
        .input(userUpdateEmailSchema)
        .mutation(async ({input}) => {
            return prisma.user.update({
                where: {email: input.oldEmail},
                data: {
                    email: input.newEmail,
                    active: false
                }
            })
        }),

    updateUserProfilePicture: protectedProcedure
        .input(userUpdateProfilePictureSchema)
        .mutation(async ({input}) => {
            const path = await saveFile(input.image)
            return  prisma.user.update({
                where: {email: input.email},
                data: {
                    profilePicture: path
                }
            })
        })

})

export default userRouter
