import {NextRequest, NextResponse} from "next/server";
import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import {HttpStatusCodes} from "@/src/utils/http-status-code";

export async function PUT(request: NextRequest) {
    try {
        const updateUserNameData = await request.json()
        await trpcServerClient.updateUserName(updateUserNameData)

        return NextResponse.json(
            {message: 'Change name Successfully'}, {status: HttpStatusCodes.OK}
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