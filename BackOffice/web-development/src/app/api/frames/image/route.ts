import {NextRequest, NextResponse} from "next/server";
import {HttpStatusCodes} from "@/src/utils/http-status-code";
import {z} from "zod";
import {extractQueryParams} from "@/src/utils/query-params/extract";
import {ImageResponse} from "next/og";
import React from "react";
// import {promises as fs} from 'fs';

import fs from 'fs';
import path from 'path';
import Image from "next/image";
import {openFile} from "@/src/lib/work-with-data/file-operations/save";

// const MyImageComponent = (name:string) => {
//     let startTime = performance.now()
//     const imagePath = name;
//
//     try {
//         const ext = path.extname(imagePath).slice(1);
//
//         console.log(ext)
//         const image = fs.readFileSync('/home/andretorneiro/Desktop/Logimade/Projects/TheiaVision/TheiaVision_Dashboard/web-development/image_2024-06-03T14:12:35.485.png', 'base64');
//         const imageUrl = `data:image/${ext};base64,${image}`;
//         let endTime = performance.now()
//
//         console.log(`reading the image took ${endTime - startTime} milliseconds`) // to test the time takes to render the image ===> between 0.2xx milliseconds and 1,xx second.
//         const headers = new Headers();
//         // remember to change the filename `test.pdf` to whatever you want the downloaded file called
//         headers.append("Content-Disposition", 'attachment; filename="image.png"');
//         headers.append("Content-Type", "image/*");
//         // headers.append("Payload", JSON.stringify(payloadMessage));
//
//         // const blob = await openFile('/home/andretorneiro/Desktop/Logimade/Projects/TheiaVision/TheiaVision_Dashboard/web-development/image_2024-06-03T14:12:35.485.png')
//         // or just use new Response ❗
//         // return new NextResponse(blob, {status: HttpStatusCodes.OK, headers});
//         // return new ImageResponse((<img src={imageUrl} />), {
//         //             headers: {
//         //                 'Content-Disposition': 'attachment; filename="image.png"',
//         //                 'Content-Type': 'image/png'
//         //             },
//         //             status: HttpStatusCodes.OK
//         //         });
//     } catch (error) {
//         console.error('Error reading image file:', error);
//         return null;
//     }
// };

const querySchema = z.object({
    filePath: z.string(),
});

export async function GET(
    request: NextRequest
) {

    try {
        const extractedQueryParams = extractQueryParams(request.url, querySchema);
        console.log(extractedQueryParams.filePath);
//         // const imagePath = path.join(process.cwd(), extractedQueryParams.filePath);
//         // console.log(imagePath)
//         // const imageBuffer = fs.readFileSync(extractedQueryParams.filePath);
//         const image = fs.readFileSync('/home/andretorneiro/Desktop/Logimade/Projects/TheiaVision/TheiaVision_Dashboard/web-development/image_2024-06-03T14:12:35.485.png', 'base64');
//         const imageUrl = `data:image/png};base64,${image}`;
// // return (MyImageComponent(extractedQueryParams.filePath
// // ));
// //         console.log(`reading the image took ${endTime - startTime} milliseconds`) // to test the time takes to render the image ===> between 0.2xx milliseconds and 1,xx second.
        const headers = new Headers();
        // remember to change the filename `test.pdf` to whatever you want the downloaded file called
        headers.append("Content-Disposition", 'attachment; filename="image.png"');
        headers.append("Content-Type", "image/*");
        // headers.append("Payload", JSON.stringify(payloadMessage));

        const blob = await openFile(extractedQueryParams.filePath)
        // or just use new Response ❗
        return new NextResponse(blob, {status: HttpStatusCodes.OK, headers});
        // return new ImageResponse(
        //     (
        //         <div style={{ display: "flex", height: "100%", width: "100%" }}>
        //             <img
        //                 src={`data:image/png;base64,${blob!.toString('base64')}`}
        //                 // src={imageUrl}
        //                 alt="logo"
        //                 style={{ height: "100%", width: "100%" }}
        //             />
        //         </div>
        //     ),
        //     {
        //         headers: {
        //             'Content-Disposition': 'attachment; filename="image.png"',
        //             'Content-Type': 'image/png'
        //         },
        //         status: HttpStatusCodes.OK
        //     }
        // );

    } catch (error: any) {
        console.log(error.message)
        let statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
        if (error.code == 'UNAUTHORIZED') {
            statusCode = HttpStatusCodes.UNAUTHORIZED
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