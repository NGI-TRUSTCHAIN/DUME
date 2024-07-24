import Path from 'path'

export function extractDateFromFileName(fileName: string) {
    // Assuming the date format is fixed and follows 'image_YYYY-MM-DDTHH:MM:SS.mmm_otherParts.yuv'
    // "2024-05-30T18:48:18.101"

    const name = Path.parse(fileName).name
    return name.split('_')[1]; // or any other specific parsing logic if needed
}