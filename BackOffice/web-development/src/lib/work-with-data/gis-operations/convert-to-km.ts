import {convertDistance} from "geolib";

export function convertToKm(distance: number){
    return convertDistance(distance,'km')
}