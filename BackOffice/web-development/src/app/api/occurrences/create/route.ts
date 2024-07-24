import {NextRequest, NextResponse} from "next/server";
import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import {HttpStatusCodes} from "@/src/utils/http-status-code";
import {prisma} from "@/src/lib/database/prisma";

export async function POST(req: NextRequest) {
    try {
        const modelClass = await req.json()

        const occurrence = await prisma.occurrence.create({
            data: {
                classId: parseInt(modelClass.classId),
                imageId: modelClass.imageId,
                state: modelClass.state
            }
        })
        return NextResponse.json(
            {message: 'Create Occurrence Successfully'}, {status: HttpStatusCodes.CREATED}
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