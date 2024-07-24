import {NextRequest, NextResponse} from "next/server";
import {HttpStatusCodes} from "@/src/utils/http-status-code";
import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import {z} from "zod";
import {openFile} from "@/src/lib/work-with-data/file-operations/save";
import {extractQueryParams} from "@/src/utils/query-params/extract";

const querySchema = z.object({
    email: z.string().email(),
});

export async function GET(
    request: NextRequest
) {

    try {

        const extractedQueryParams = extractQueryParams(request.url, querySchema);

        const user = await trpcServerClient.getUser({email: extractedQueryParams.email});

        if (!user) {
            return NextResponse.json(
                {error: 'Account not existent'}, {status: HttpStatusCodes.BAD_REQUEST}
            )
        }

        // User is not active, tell them to activate-account
        if (!user.active) {
            return NextResponse.json(
                {message: 'User is not active. Validate your account.'}, {status: HttpStatusCodes.UNAUTHORIZED}
            )
        }

        const {id, password, active, profilePicture, createdAt, countryId, notificationId, ...userDetails} = user
        const payloadMessage = {
            ...userDetails,
        };

        const headers = new Headers();
        // remember to change the filename `test.pdf` to whatever you want the downloaded file called
        headers.append("Content-Disposition", 'attachment; filename="image.png"');
        headers.append("Content-Type", "image/*");
        headers.append("Payload", JSON.stringify(payloadMessage));

        const blob = await openFile(user.profilePicture!)
        // or just use new Response ❗
        return new NextResponse(blob, {status: HttpStatusCodes.OK, headers});

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