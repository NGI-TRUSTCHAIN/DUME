import {PrismaClient} from "@prisma/client";

// https://www.prisma.io/blog/backend-prisma-typescript-orm-with-postgresql-auth-mngp1ps7kip4

const globalForPrisma = global as unknown as { prisma: PrismaClient}

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query']
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma