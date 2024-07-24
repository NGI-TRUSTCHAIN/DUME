import {z} from "zod";
import {NextRequest, NextResponse} from "next/server";
import {extractQueryParams} from "@/src/utils/query-params/extract";
import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import {HttpStatusCodes} from "@/src/utils/http-status-code";

const querySchema = z.object({
    email: z.string().email(),
});

export async function GET(
    request: NextRequest
) {

    try {

        const extractedQueryParams = extractQueryParams(request.url, querySchema);

        const user = await trpcServerClient.getUser({email: extractedQueryParams.email});

        const dates = await trpcServerClient.getVideosLimitsDate({userId: user!.id});

        return NextResponse.json({message: dates}, {status: HttpStatusCodes.OK});
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