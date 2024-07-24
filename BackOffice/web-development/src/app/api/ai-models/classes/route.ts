import {NextRequest, NextResponse} from "next/server";
import {extractQueryParams} from "@/src/utils/query-params/extract";
import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import {HttpStatusCodes} from "@/src/utils/http-status-code";
import {prisma} from "@/src/lib/database/prisma";

export async function GET(
    _request: NextRequest
) {

    try {
        // const extractedQueryParams = extractQueryParams(request.url, querySchema);

        const frames = await prisma.class.findMany();

        return NextResponse.json({message: frames}, {status: HttpStatusCodes.OK});
    } catch (error: any) {
        console.error(error);

        return new NextResponse(
            JSON.stringify({
                error: error.message
            }),
            {
                status: HttpStatusCodes.INTERNAL_SERVER_ERROR
            }
        )
    }
}