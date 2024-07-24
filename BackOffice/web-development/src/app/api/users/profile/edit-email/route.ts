import {NextRequest, NextResponse} from "next/server";
import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import {HttpStatusCodes} from "@/src/utils/http-status-code";

import {randomUUID} from "crypto";
import {prisma} from "@/src/lib/database/prisma";
import { emailVerificationType } from "@/src/lib/send-email/types";
import { sendVerificationEmail } from "@/src/lib/send-email/nodemailer-api";

function generateToken(){
    return `${randomUUID()}${randomUUID()}`.replace(/-/g, '')
}


export async function PUT(request: NextRequest) {
    try {
        const updateUserEmail = await request.json()
        const user = await trpcServerClient.updateUserEmail(updateUserEmail)

        console.log(user)

        const tokenID = await prisma.activateToken.findFirst({
            where: {
                userId: user.id
            }
        })
        await prisma.activateToken.delete({
            where: {
                id: tokenID!.id
            }
        })
        const token = await prisma.activateToken.create({
            data: {
                userId: user.id,
                token: generateToken()}
        })

        const emailVerification: emailVerificationType = {
            email: user.email,
            name: user.name || '', // Handle the null case appropriately
            token: token.token
        };

        await sendVerificationEmail(emailVerification, 'activate-account')

        return NextResponse.json(
            {message: 'Change email Successfully. Please Validate Account'}, {status: HttpStatusCodes.OK}
        )

    } catch (error: any) {
        console.log(error.message)
        let statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
        if (error.code == 'UNAUTHORIZED') {
            statusCode = HttpStatusCodes.UNAUTHORIZED
        }
        return new NextResponse(
            JSON.stringify({
                error: error.message

            }),
            {
                status: statusCode
            }
        )
    }
}
