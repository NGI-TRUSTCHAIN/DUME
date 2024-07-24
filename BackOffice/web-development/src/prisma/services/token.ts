import { prisma } from "@/src/lib/database/prisma"
import { randomUUID } from "crypto"


export class TokenQueries {

    private readonly userId: number

    constructor(userId: number) {
        this.userId = userId
    }
    private generateToken(){
        return `${randomUUID()}${randomUUID()}`.replace(/-/g, '')
    }

    public async createToken() {
        return prisma.activateToken.create({
            data:{
                userId: this.userId,
                token: this.generateToken()
            }
        })
    }

}