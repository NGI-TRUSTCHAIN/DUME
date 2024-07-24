import {NextRequest, NextResponse} from "next/server";
import {HttpStatusCodes} from "@/src/utils/http-status-code";
import {z} from "zod";
import {extractQueryParams} from "@/src/utils/query-params/extract";
import {ImageResponse} from "next/og";
import React from "react";
import {imagesPrismaClientSql} from "@/src/prisma/_raw-queries/images/prisma-client-sql";

const querySchema = z.object({
    latitude: z.string().regex(/^(-?\d+(\.\d+)?)$/),
    longitude: z.string().regex(/^(-?\d+(\.\d+)?)$/),
});

export async function GET(
    request: NextRequest
) {

    try {

        const extractedQueryParams = extractQueryParams(request.url, querySchema);

        const lat = parseFloat(extractedQueryParams.latitude);
        const long = parseFloat(extractedQueryParams.longitude);

        const images = await imagesPrismaClientSql.image.findByCoordinates(lat, long)

        return NextResponse.json({message: images}, {status: HttpStatusCodes.OK});

    } catch (error: any) {
        console.log(error.message)
        let statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
        if (error.code == 'UNAUTHORIZED') {
            statusCode = HttpStatusCodes.UNAUTHORIZED
        }

        if (error.code == 'CONFLICT') {
            statusCode = HttpStatusCodes.ALREADY_REPORTED
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