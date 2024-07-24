import { trpcServerClient } from '@/src/app/_trpc/serverClient'
import { HttpStatusCodes } from '@/src/utils/http-status-code'
import {NextRequest, NextResponse} from 'next/server'


export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        console.log(data)

        const res = await trpcServerClient.addVideo(data)

        if (!res) {
            return NextResponse.json(
                {message: "Invalid request"}, {status: HttpStatusCodes.BAD_REQUEST}
            )
        }
        console.log(res)

        return NextResponse.json({success: true})

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