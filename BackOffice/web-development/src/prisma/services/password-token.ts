import { randomUUID } from "crypto"
import {prisma} from "@/src/lib/database/prisma";


export class PasswordTokenQueries {


    private generateToken(){
        return `${randomUUID()}${randomUUID()}`.replace(/-/g, '')
    }

    public async createToken(userId: number) {

        return prisma.passwordResetToken.create({
            data:{
                userId: userId,
                token: this.generateToken()
            }
        })
    }

    public async findToken(token: string) {
        return prisma.passwordResetToken.findUnique({
            where: {
               token,
                createdAt: { gt: new Date(Date.now() - 1000 * 60 * 60 * 4) },
                resetAt: null,
            },
        })
    }

    public updateToken(tokenId: number) {

        return prisma.passwordResetToken.update({
            where: {
                id: tokenId,
            },
            data: {
                resetAt: new Date(),
            },
        })
    }


}