import {NextRequest, NextResponse} from "next/server";
import {HttpStatusCodes} from "@/src/utils/http-status-code";
import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import {compare} from "bcrypt";
import {z} from "zod";
import { emailVerificationType } from "@/src/lib/send-email/types";
import { sendVerificationEmail } from "@/src/lib/send-email/nodemailer-api";


const userSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});


export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()

        const user = await trpcServerClient.getUser(body)

        if (!user) {
            return NextResponse.json(
                {error: 'Account not existent'}, {status: HttpStatusCodes.BAD_REQUEST}
            )
        }

        // User is not active, tell them to activate-account
        if (!user.active) {
            return NextResponse.json(
                {message: 'User is not active. Validate your account.'}, {status: HttpStatusCodes.UNAUTHORIZED}
            )
        }

        const isPasswordValid = await compare(
            body.password,
            user.password
        )

        if (!isPasswordValid) {
            return NextResponse.json(
                {error: 'Wrong Password'}, {status: HttpStatusCodes.NOT_ACCEPTABLE}
            )
        }

        const token = await trpcServerClient.createPasswordToken({userId: user.id})

        const emailVerification: emailVerificationType = {
            email: user.email,
            name: user.name || '', // Handle the null case appropriately
            token: token.token
        };

        await sendVerificationEmail(emailVerification, 'reset-password')

        return NextResponse.json(
            {message: 'Request Reset Password Successfully' }, { status: HttpStatusCodes.ACCEPTED }
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