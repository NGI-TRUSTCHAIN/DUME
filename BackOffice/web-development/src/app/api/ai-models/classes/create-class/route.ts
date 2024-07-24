import {NextRequest, NextResponse} from "next/server";
import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import {HttpStatusCodes} from "@/src/utils/http-status-code";

export async function POST(req: NextRequest) {
    try {
        const modelClass = await req.json()

        await trpcServerClient.createClasses(modelClass)
        return NextResponse.json(
            {message: 'Create Class Successfully'}, {status: HttpStatusCodes.CREATED}
        )
    } catch (err: any) {
        console.log(err.message)
        return new NextResponse(
            JSON.stringify({
                error: err.message
            }),
            {
                status: HttpStatusCodes.INTERNAL_SERVER_ERROR
            }
        )
    }
}