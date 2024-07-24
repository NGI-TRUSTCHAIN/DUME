import {NextRequest, NextResponse} from "next/server";
import {HttpStatusCodes} from "@/src/utils/http-status-code";
import {z} from "zod";
import {prisma} from "@/src/lib/database/prisma";
import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import {emailVerificationType} from "@/src/lib/send-email/types";
import { sendVerificationEmail } from "@/src/lib/send-email/nodemailer-api";


const forgotPasswordSchema = z.object({
    email: z.string().email(),
});


export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const validation = forgotPasswordSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {message: 'Invalid Parameter or Email' }, { status: HttpStatusCodes.BAD_REQUEST }
            )
        }

        const user = await prisma.user.findUnique({
            where: {email: validation.data.email},
            select: {
                id:true,
                email: true,
                name: true,
                passwordResetTokens: {
                    select: {
                        id: true
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json(
                {error: 'Account not existent'}, {status: HttpStatusCodes.BAD_REQUEST}
            )
        }

        let token
        if (!user.passwordResetTokens || user.passwordResetTokens.length === 0) {
           token = await trpcServerClient.createPasswordToken({userId: user.id})
        }
        else {
            token = await trpcServerClient.updatePasswordToken({tokenId: user.passwordResetTokens[0].id})
        }

        const emailVerification: emailVerificationType = {
            email: user!.email,
            name: user!.name || '', // Handle the null case appropriately
            token: token.token
        };

        await sendVerificationEmail(emailVerification, 'reset-password')

        return NextResponse.json(
            {message: 'Request Forgot Password Successfully' }, { status: HttpStatusCodes.ACCEPTED }
        )
    }
    catch (error: any) {
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