import {z} from "zod";
import {zfd} from "zod-form-data";

const coordinatesValidator = z.string().refine(
    (coords) => {
        try {
            const parsedCoords = JSON.parse(coords);
            return typeof parsedCoords === "object" && parsedCoords !== null && "lat" in parsedCoords && "long" in parsedCoords;
        } catch (error) {
            return false;
        }
    },
    {message: "Both 'lat' and 'long' fields are required."}
).refine(
    (coords) => {
        const {lat, long} = JSON.parse(coords);
        return typeof lat === "number" && typeof long === "number";
    },
    {message: "'lat' and 'long' fields must be numbers."}
)

// const multipleCoordinatesValidator = z.array(uniqueCoordinateValidator)

// export const singleCoordinatesSchema = zfd.formData({
//     singleCoordinates: coordinatesValidator,
// })
// //     .refine((gps) => gps.coordinates || gps.singleCoordinates, {
// //     message: "At least one of 'coordinates' or 'singleCoordinates' is required.",
// //     path: ["coordinates", "singleCoordinates"]
// // })

// export const coordinatesSchema = zfd.formData({
//     coordinates: coordinatesValidator,
// })

export const coordinatesSchema = z.object({
    latitude: z.number(),
    longitude: z.number()
})