import {hash} from "bcrypt";
import {prisma} from "@/src/lib/database/prisma";
import {hashingData} from "@/src/lib/work-with-data/encryption/hash-data";

export interface IUserCredentials {
    email: string,
    password: string
}

interface IUserProfile {
    email: string,
    name: string
}

export interface IUserEmailCredential{
    email : string
}

export interface IUserResetPasswordCredential{
    password: string,
    tokenId: number
}


export default class UserQueries {


    public async createUser(user: IUserCredentials) {

        console.log(user.password)

        const encrypted = await hashingData(user.password)

        return prisma.user.create({
            data: {
                email: user.email,
                password: encrypted

            },
        });
    }

    public async findUser(user: IUserEmailCredential) {

        return prisma.user.findUnique({
            where: {email: user.email}
        })
    }

    public updatePassword(user: IUserResetPasswordCredential) {

        return prisma.user.update({
            where: {id: user.tokenId},
            data: {
                password: user.password,
            },
        });
    }
}
