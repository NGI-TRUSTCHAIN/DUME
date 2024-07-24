import {NextRequest, NextResponse} from "next/server";
import {HttpStatusCodes} from "@/src/utils/http-status-code";
import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import {z} from "zod";
import {extractQueryParams} from "@/src/utils/query-params/extract";

const querySchema = z.object({
    videoId: z.string().uuid()
});

export async function GET(
    request: NextRequest
) {

    try {
        const extractedQueryParams = extractQueryParams(request.url, querySchema);

        const frames = await trpcServerClient.getFramesFromVideo(extractedQueryParams);

        return NextResponse.json({message: frames}, {status: HttpStatusCodes.OK});
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