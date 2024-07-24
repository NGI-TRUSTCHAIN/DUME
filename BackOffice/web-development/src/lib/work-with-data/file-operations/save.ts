import {readFile, writeFile} from "fs/promises";
import path from "node:path";

export async function saveFile(file: File) {

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // With the file data in the buffer, you can do whatever you want with it.
    // For this, we'll just write it to the filesystem in a new location
    const filePath = path.join(process.cwd(),'IMG_APP', `${file.name}`)
    try {
        await writeFile(filePath, buffer)
        return filePath
    } catch (error) {
        console.log(error)
        throw new Error('Error saving file on disk')
    }

}

export async function openFile(file: string) {
    try {
        return await readFile(file)
    }
    catch (error) {
        console.error(error)
    }
}