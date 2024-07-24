import {NextRequest, NextResponse} from "next/server";
import {HttpStatusCodes} from "@/src/utils/http-status-code";
import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import {z} from "zod";
import {extractQueryParams} from "@/src/utils/query-params/extract";
import {prisma} from "@/src/lib/database/prisma";
import {parsePoint} from "@/src/lib/work-with-data/gis-operations/decode-points";

export const querySchema = z.object({
    startingRow: z.string().regex(/^\d+$/), // Validate as string, convert to number later
    numberOfRows: z.string().regex(/^\d+$/),
    orderBy: z.enum(['asc', 'desc']).optional(),
    dateStart: z.string().optional(),
    dateEnd: z.string().optional(),
    occurrenceStatus: z.enum(['solved', 'pending', 'notSolved']).optional(),
    classId: z.string().regex(/^\d+$/).optional(),
});


export async function GET(
    request: NextRequest
) {

    try {
        const extractedQueryParams = extractQueryParams(request.url, querySchema);

        const startingRowNumber = parseInt(extractedQueryParams.startingRow, 10);
        const numberOfRowsNumber = parseInt(extractedQueryParams.numberOfRows, 10);
        const classIdNumber = parseInt(extractedQueryParams.classId, 10);

        const whereClause: any = {};

        if (extractedQueryParams.dateStart) {
            whereClause.date = whereClause.date || {};
            whereClause.date.gte = new Date(extractedQueryParams.dateStart);
        }

        if (extractedQueryParams.dateEnd) {
            whereClause.date = whereClause.date || {};
            whereClause.date.lte = new Date(extractedQueryParams.dateEnd);
        }

        if (extractedQueryParams.occurrenceStatus) {
            whereClause.state = extractedQueryParams.occurrenceStatus;
        }

        if (extractedQueryParams.classId) {
            whereClause.classId = classIdNumber;
        }
        const occurrences = await prisma.occurrence.findMany({
            skip: startingRowNumber,
            take: numberOfRowsNumber,
            orderBy: {
                date: extractedQueryParams.orderBy,
            },
            where: whereClause,
            select: {
                id: true,
                date: true,
                state: true,
                classId: true,
                image: {
                    select: {
                        id: true,
                        url: true, // Include the image URL in the result
                    }
                },
                // Add other fields you need to select
            }
        });
        const whereClauses = [];
        const queryParams = [];

        if (extractedQueryParams.dateStart) {
            whereClauses.push(`o.date >= $${whereClauses.length + 1}`);
            queryParams.push(new Date(extractedQueryParams.dateStart));
        }

        if (extractedQueryParams.dateEnd) {
            whereClauses.push(`o.date <= $${whereClauses.length + 1}`);
            queryParams.push(new Date(extractedQueryParams.dateEnd));
        }

        if (extractedQueryParams.occurrenceStatus) {
            whereClauses.push(`o.state = $${whereClauses.length + 1}`);
            queryParams.push(extractedQueryParams.occurrenceStatus);
        }

        if (extractedQueryParams.classId) {
            whereClauses.push(`o."classId" = $${whereClauses.length + 1}`);
            queryParams.push(classIdNumber);
        }

        const whereClauseString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const rawQuery = `
            SELECT
                o.id,
                o.date,
                o.state,
                o."classId",
                i.url,
                ST_AsText(i.coordinates) AS coordinates,
                v.id AS "videoId"
            FROM
                "Occurrence" o
                JOIN "Image" i ON o."imageId" = i.id
                JOIN "Video" v ON i."videoId" = v.id
            ${whereClauseString}
            ORDER BY o.date ${extractedQueryParams.orderBy === 'asc' ? 'ASC' : 'DESC'}
            OFFSET $${queryParams.length + 1}
            LIMIT $${queryParams.length + 2}
        `;

        queryParams.push(startingRowNumber, numberOfRowsNumber);

        const occurrences1 = await prisma.$queryRawUnsafe(rawQuery, ...queryParams);

        // @ts-ignore
        const formattedOccurrences = occurrences1.map((occurrence: any) => ({
            ...occurrence,
            coordinates: parsePoint(occurrence.coordinates),
        }));


        return NextResponse.json({message: formattedOccurrences}, {status: HttpStatusCodes.OK});
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