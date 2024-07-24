import {createVideoDBSchema} from "@/prisma/_raw-queries/videos/schemas";

type MyPoint = {
    latitude: number
    longitude: number
}

type MyPointOfInterest = {
    name: string
    location: MyPoint
}

// const prisma = new PrismaClient().$extends({
//     model: {
//         pointOfInterest: {
//             async create(data: {
//                 name: string
//                 latitude: number
//                 longitude: number
//             }) {
//                 // Create an object using the custom types from above
//                 const poi: MyPointOfInterest = {
//                     name: data.name,
//                     location: {
//                         latitude: data.latitude,
//                         longitude: data.longitude,
//                     },
//                 }
//
//                 // Insert the object into the database
//                 const point = `POINT(${poi.location.longitude} ${poi.location.latitude})`
//                 await prisma.$queryRaw`
//           INSERT INTO "PointOfInterest" (name, location) VALUES (${poi.name}, ST_GeomFromText(${point}, 4326));
//         `
//
//                 // Return the object
//                 return poi
//             },
//         },
//     },
// })

// async function main() {
//
//     const password = await hash('test', 12)
//     const alice = await prisma.pointOfInterest.create({
//         name: 'Berlin',
//         latitude: 52.52,
//         longitude: 13.405,
//     })
//
//     console.log(alice)
// }

async function test() {
    // const data: createVideoDBSchema = {
    //     name: "a",
    //     dateStart: new Date('2024-07-21'),
    //     dateEnd: new Date('2024-07-21'),
    //     coordinateStart: {
    //         latitude: 22.0,
    //         longitude: 23.0
    //     },
    //     coordinateEnd: {
    //         latitude: 22.5,
    //         longitude: 28.9
    //     }
    // }
    // try{
    //     console.log(await new VideoQueries().create(data))
    // }catch (error){
    //     console.log(error)
    // }


}

// test()

    // .then(async () => {
    //
    //     await prisma.$disconnect()
    //
    // })
    //
    // .catch(async (e) => {
    //
    //     console.error(e)
    //
    //     await prisma.$disconnect()
    //
    //     process.exit(1)
    //
    // })