import { z } from "zod";

export const classSchema = z.object({
    name: z.string()
})