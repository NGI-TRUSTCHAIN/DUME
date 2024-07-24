export function calculateUpload(received: number, total: number): number {
    return Math.round((received / total) * 100)
}