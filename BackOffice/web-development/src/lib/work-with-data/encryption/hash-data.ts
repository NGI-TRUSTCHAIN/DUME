import {hash} from "bcrypt";

export async function hashingData(password: string, length: number = 12): Promise<string> {
    return hash(password, length)
}