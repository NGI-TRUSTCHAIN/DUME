import { trpcServerClient } from "@/src/app/_trpc/serverClient";
import { HttpStatusCodes } from "@/src/utils/http-status-code";
import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/src/lib/database/prisma";


export async function DELETE(req: NextRequest) {
    try {
        const occurrenceID = await req.json()
        await prisma.occurrence.delete({
            where: {
                id: Number(occurrenceID.id)
            }
        })

        return NextResponse.json(
            {message: 'Deleted Occurrence Successfully'}, {status: HttpStatusCodes.OK}
        )

    } catch (error: any) {
        console.error(error)
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