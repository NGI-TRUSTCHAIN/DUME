import {z} from "zod";
import {NextRequest, NextResponse} from "next/server";
import {extractQueryParams} from "@/src/utils/query-params/extract";
import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import {HttpStatusCodes} from "@/src/utils/http-status-code";
import {prisma} from "@/src/lib/database/prisma";


export async function GET(
    _request: NextRequest
) {

    try {

        const dates = await prisma.occurrence.findMany({
            orderBy: {
                date: 'asc'
            }
        })

        console.log(dates)

        // @ts-ignore
        return NextResponse.json({
            message: {
                'oldest occurrence': dates.at(0).date,
                'newest occurrence': dates.at(-1).date,
            }
        }, {status: HttpStatusCodes.OK});

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