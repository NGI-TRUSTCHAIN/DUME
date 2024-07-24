import {GISPoint} from "@/src/prisma/_raw-queries/shared-types";

export type createFrameDBSchema = {
    name: string
    date: Date
    coordinates: GISPoint,
    videoId: string,
    url: string
}

