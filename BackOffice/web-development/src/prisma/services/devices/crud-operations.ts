import {prisma} from "@/lib/database/prisma";
import {z} from "zod";

export const devicesEnum = z.enum(["MOBILE", "COMPANION"]);
type devicesEnum = z.infer<typeof devicesEnum>;

type test = {
    name: string
}
export default class DevicesQueries {
    public async create(device: string) {
        return prisma.device.create({
            data: {
                name: device
            }
        })
    }

    public async read(query: string) {
        return prisma.device.findUnique({
            where: { name: query },
            select: {
                id: true,
            }
        });
    }

    public async update(){
        return prisma
    }

    public async delete() {
        return prisma
    }
}