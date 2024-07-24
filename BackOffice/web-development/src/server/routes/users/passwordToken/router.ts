import {protectedProcedure, publicProcedure, router} from "@/src/server/trpc";
import {prisma} from "@/src/lib/database/prisma";
import {userResetPasswordSchema, UserTokenSchema} from "@/src/server/routes/users/passwordToken/_schemas";
import {randomUUID} from "crypto";

function generateToken(){
    return `${randomUUID()}${randomUUID()}`.replace(/-/g, '')
}

const PasswordTokenRouter = router({
    createPasswordToken: publicProcedure
        .input(UserTokenSchema)
        .mutation(async ({input}) => {
           return prisma.passwordResetToken.create({
               data:{
                   userId: input.userId,
                   token: generateToken()
               }
           })
        }),


    updatePasswordToken: publicProcedure
        .input(userResetPasswordSchema)
        .mutation(async ({input}) => {
            return prisma.passwordResetToken.update({
                where: {id: input.tokenId},
                data: {
                    resetAt: new Date(),
                },
            });
        }),
});

export default PasswordTokenRouter