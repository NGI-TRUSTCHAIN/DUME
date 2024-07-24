import {NextRequest, NextResponse} from "next/server";
import { trpcServerClient } from "@/src/app/_trpc/serverClient";
import { HttpStatusCodes } from "@/src/utils/http-status-code";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const result = await  trpcServerClient.createDevice(body)

        if (!result)
            return NextResponse.json(
                {message: 'Cannot register Device'}, {status: HttpStatusCodes.BAD_REQUEST}
            )

        return NextResponse.json({success: true})

    } catch (err: any) {
        let statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
        if (err.code == 'UNAUTHORIZED') {
            statusCode = HttpStatusCodes.UNAUTHORIZED
        }
        return new NextResponse(
            JSON.stringify({
                error: err.message

            }),
            {
                status: statusCode
            }
        )
    }
}