import getDistance from "geolib/es/getPreciseDistance";
import {convertToKm} from "@/src/lib/work-with-data/gis-operations/convert-to-km";
import { GISPoint } from "@/src/prisma/_raw-queries/shared-types";

export function calculateDistance(startCoordinates: GISPoint, endCoordinates: GISPoint) {

    const distance = getDistance(startCoordinates, endCoordinates)
    return convertToKm(distance)
}
