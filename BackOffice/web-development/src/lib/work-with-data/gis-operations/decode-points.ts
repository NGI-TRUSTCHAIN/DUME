import {Point} from "unist";
import {GISPoint} from "@/src/prisma/_raw-queries/shared-types";

export function parsePoint(point: string) {
    const match = point.match(/POINT\(([^ ]+) ([^ ]+)\)/);
    if (match) {
        return {
            longitude: parseFloat(match[1]),
            latitude: parseFloat(match[2]),
        };
    }
 return null;
}
