import {NextRequest, NextResponse} from "next/server";
import {HttpStatusCodes} from "@/src/utils/http-status-code";
import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import {z} from "zod";
import {extractQueryParams} from "@/src/utils/query-params/extract";

const querySchema = z.object({
    email: z.string().email(),
    startingRow: z.string().regex(/^\d+$/), // Validate as string, convert to number later
    numberOfRows: z.string().regex(/^\d+$/),
    orderBy: z.enum(['asc', 'desc']),
    dateStart: z.string().optional(),
    dateEnd: z.string().optional(),
    uploadStatus: z.enum(['uploaded', 'uploading']).optional()
});

export async function GET(
    request: NextRequest
) {

    try {
        const extractedQueryParams = extractQueryParams(request.url, querySchema);

        const user = await trpcServerClient.getUser({email: extractedQueryParams.email});

        const videos = await trpcServerClient.getPaginatedVideos({
            startingRow: Number(extractedQueryParams.startingRow),
            numberOfRows: Number(extractedQueryParams.numberOfRows),
            userId: user!.id,
            orderBy: extractedQueryParams.orderBy,
            dateStart: extractedQueryParams.dateStart ? new Date(extractedQueryParams.dateStart) : undefined,
            dateEnd: extractedQueryParams.dateEnd ? new Date(
                new Date(extractedQueryParams.dateEnd)
                    .setHours(23, 59, 59, 999)) : undefined,
            uploadStatus: extractedQueryParams.uploadStatus? extractedQueryParams.uploadStatus : undefined,
        })

        return NextResponse.json({message: videos}, {status: HttpStatusCodes.OK});
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