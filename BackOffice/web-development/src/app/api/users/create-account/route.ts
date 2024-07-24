/**
 * @swagger
 * /api/test:
 *   get:
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: Hello World!
 */


import {NextRequest, NextResponse} from 'next/server'
import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import {HttpStatusCodes} from '@/src/utils/http-status-code';
import {TokenQueries} from "@/src/prisma/services/token";
import {emailVerificationType} from "@/src/lib/send-email/types";
import {sendVerificationEmail} from '@/src/lib/send-email/nodemailer-api';


export async function POST(req: NextRequest) {
    try {
        const userCredentials = await req.json()

        const user = await trpcServerClient.createUser(userCredentials)

        console.log(user)

        const token = await new TokenQueries(user.id).createToken()

        const emailVerification: emailVerificationType = {
            email: user.email,
            name: user.name || '', // Handle the null case appropriately
            token: token.token
        };

        await sendVerificationEmail(emailVerification, 'activate-account')

        return NextResponse.json(
            {message: 'Create Account Successfully'}, {status: HttpStatusCodes.CREATED}
        )
    } catch (error: any) {
        console.log(error.message)
        let statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
        if (error.code == 'UNAUTHORIZED') {
            statusCode = HttpStatusCodes.UNAUTHORIZED
        }

        if (error.code == 'CONFLICT') {
            statusCode = HttpStatusCodes.ALREADY_REPORTED
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