import { trpcServerClient } from "@/src/app/_trpc/serverClient";
import { HttpStatusCodes } from "@/src/utils/http-status-code";
import {NextRequest, NextResponse} from "next/server";


export async function DELETE(req: NextRequest) {
    try {
        const videoId = await req.json()
        await trpcServerClient.deleteVideo(videoId)

        return NextResponse.json(
            {message: 'Deleted Video Successfully'}, {status: HttpStatusCodes.OK}
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