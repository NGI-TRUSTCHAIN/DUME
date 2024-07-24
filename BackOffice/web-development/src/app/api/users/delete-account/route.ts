import { trpcServerClient } from "@/src/app/_trpc/serverClient";
import { HttpStatusCodes } from "@/src/utils/http-status-code";
import {NextRequest, NextResponse} from "next/server";


export async function DELETE(req: NextRequest) {
    try {
        const userCredentials = await req.json()
        await trpcServerClient.deleteUser(userCredentials)

        return NextResponse.json(
            {message: 'Deleted Account Successfully'}, {status: HttpStatusCodes.OK}
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