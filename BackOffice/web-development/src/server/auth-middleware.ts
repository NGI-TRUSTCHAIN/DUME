import {cookies, headers} from "next/headers";
import {TRPCError} from "@trpc/server";
import {verifyJwt} from "@/src/lib/auth/jwt";
import {prisma} from "@/src/lib/database/prisma";

export const deserializeUser = async () => {
    try {
        const jwtToken = headers().get('authorization')?.split("Bearer ").at(1)

        const notAuthenticated = {
            user: null,
        };

        if (!jwtToken || !verifyJwt(jwtToken)) {
            return notAuthenticated
        }

        const decoded = verifyJwt(jwtToken);

        const user = await prisma.user.findUnique({where: {email: decoded!['email']!}});

        if (!user) {
            return notAuthenticated;
        }

        const {password, ...userWithoutPassword} = user;
        return {
            user: userWithoutPassword,
        };
    } catch (error: any) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message
        });
    }

}