import {trpcServerClient} from "@/src/app/_trpc/serverClient";
import {validateSchema} from "@/src/lib/work-with-data/zod-validators";
import {frameSchema} from "@/src/lib/work-with-data/zod-validators/frames/validators";
import {HttpStatusCodes} from "@/src/utils/http-status-code";
import {NextRequest, NextResponse} from "next/server";
import {saveFile} from "@/src/lib/work-with-data/file-operations/save";
import {imageSchemaType} from "@/src/server/routes/images/schemas";
import {extractDateFromFileName} from "@/src/utils/extract-string-from-filename";
import {file} from "zod-form-data";
import {prisma} from "@/src/lib/database/prisma";


export async function POST(request: NextRequest) {

    try {

        const data = await request.formData()

        const {validatedSchema, errors} = validateSchema(data, frameSchema)

        if (errors) {
            return NextResponse.json(
                {message: "Invalid request", errors}, {status: HttpStatusCodes.BAD_REQUEST}
            )
        }

        const imagesKey = validatedSchema.data.frame ? 'frame' : 'frames'
        const files = validatedSchema.data[imagesKey] as FileList
        if (!files) {
            return NextResponse.json({message: 'Missing Files'}, {status: HttpStatusCodes.BAD_REQUEST})
        }

        const parsedMetadata: imageSchemaType[] = JSON.parse(validatedSchema.data['frameMetadata']);

        const {videoId} = parsedMetadata[0]

        const fileList = Array.isArray(files) ? files : [files];

        for (const file of fileList) {

            // Derive the date from the file name
            const date = extractDateFromFileName(file.name);

            const frameMetadata = parsedMetadata.find(metadata => metadata.date === date);
            if (!frameMetadata) {
                return NextResponse.json(
                    {message: `No metadata found for file ${file.name}`},
                    {status: 400}
                );
            }

            const existentVideo = await prisma.image.findUnique({
                where:
                    {
                        id: frameMetadata.frameId
                    }
            })

            if (existentVideo) {
                continue
            }

            const filePath = await saveFile(file);
            console.log(`File saved at ${filePath}`);
            const url = process.env.CONVERT_PUBLIC_URL || 'http://app2:9000/convert-images/yuv-to-rgb/'
            console.log(url)
            if (filePath.endsWith('yuv')) {
                const response = await fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({'path': filePath}),
                });

                if (!response.ok) {
                    console.log(response)
                    return NextResponse.json(
                        {message: `Failed to convert file ${file.name}`},
                        {status: 400}
                    );
                }

                const body = await response.json()
                frameMetadata.url = (`https://theiabo.logimade.com/api/frames/image?filePath=${body.url!}`); // Include file path in metadata if needed
            } else {
                frameMetadata.url = (`https://theiabo.logimade.com/api/frames/image?filePath=${filePath!}`); // Include file path in metadata if needed
            }


            const res = await trpcServerClient.addImage(frameMetadata);
            if (!res) {
                return NextResponse.json(
                    {message: "Invalid request"},
                    {status: 400}
                );
            }
        }

        const filesLength = imagesKey === 'frame' ? 1 : files.length;

        await trpcServerClient.updateReceivedFrames({
            videoId: videoId,
            totalFrames: filesLength
        });

        return NextResponse.json({message: 'Files and metadata processed successfully'}, {status: 200});
    } catch (error: any) {
        console.log(error.message)
        let statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
        if (error.code == 'UNAUTHORIZED') {
            statusCode = HttpStatusCodes.UNAUTHORIZED
        }
        if (error.code == 'CONFLICT') {
            statusCode = HttpStatusCodes.ALREADY_REPORTED
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