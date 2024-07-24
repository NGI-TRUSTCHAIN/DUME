import {z} from "zod";
import {NextResponse} from "next/server";

export function extractQueryParams(query: string, querySchema: z.ZodSchema<any>): any {
    const url = new URL(query);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    const validation = querySchema.safeParse(queryParams);

    if (!validation.success) {
        throw new Error('Invalid query parameter');
    }

    return validation.data
}