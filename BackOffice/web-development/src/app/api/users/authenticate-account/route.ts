import {NextRequest, NextResponse} from "next/server";

import {z} from "zod";
import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import { HttpStatusCodes } from "@/src/utils/http-status-code";
import { signJwtAccessToken } from "@/src/lib/auth/jwt";
import {compare} from "bcrypt";

export async function POST(request: NextRequest) {
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
                {message: 'User is not active. Validate your account.'}, {status: HttpStatusCodes.FORBIDDEN}
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

        const {id, password, profilePicture, active, createdAt, countryId, notificationId, ...userDetails} = user
        const accessToken = signJwtAccessToken(userDetails);
        const payloadMessage = {
            ...userDetails,
            accessToken,
        };

        return NextResponse.json(
            {message: payloadMessage}, {status: HttpStatusCodes.ACCEPTED}
        )

    } catch (error: any) {
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