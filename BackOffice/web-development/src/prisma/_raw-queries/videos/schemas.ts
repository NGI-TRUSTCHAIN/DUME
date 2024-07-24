import {GISPoint} from "@/prisma/_raw-queries/shared-types";

export type createVideoDBSchema = {
    name: string
    dateStart: Date
    dateEnd: Date
    coordinateStart: GISPoint
    coordinateEnd: GISPoint
    origin: string,
    username: string,
    totalFrames: number,
}

