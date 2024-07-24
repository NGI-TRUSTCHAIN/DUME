import {randomUUID} from "crypto";

export function generateToken(){
    return `${randomUUID()}${randomUUID()}`.replace(/-/g, '')
}