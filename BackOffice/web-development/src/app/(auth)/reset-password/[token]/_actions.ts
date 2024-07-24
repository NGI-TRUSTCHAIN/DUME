'use server'

import { PasswordTokenQueries } from "@/src/prisma/services/password-token"
import {IUserResetPassword} from "./page"
import UserQueries from "@/src/prisma/services/user"
import { hashingData } from "@/src/lib/work-with-data/encryption/hash-data"
import { prisma } from "@/src/lib/database/prisma"
import {redirect} from "next/navigation";


export async function resetPassword(token: string, data: IUserResetPassword) {

    if (!data.password || data.password !== data.confirmPassword) {
        return {
            error:
                'The passwords did not match. Please try retyping them and submitting again.',
        }
    }

    const passwordResetToken = await new PasswordTokenQueries().findToken(token)

    if (!passwordResetToken) {
        return {
            error:
                'Invalid token reset request. Please try resetting your password again.',
        }
    }

    const userQuery = new UserQueries()
    const encryptedPassword = await hashingData(data.confirmPassword)

    const updateUser = userQuery.updatePassword({password: encryptedPassword, tokenId: passwordResetToken.userId})

    const updateToken = prisma.passwordResetToken.update({
        where: {
            id: passwordResetToken.id,
        },
        data: {
            resetAt: new Date(),
        },
    })

    try {
        await prisma.$transaction([updateUser, updateToken])

    } catch (err) {
        console.error(err)
        return {
            error: `An unexpected error occurred. Please try again and if the problem persists, contact support.`,
        }
    } finally {
        redirect('/reset-password/success')
    }


}