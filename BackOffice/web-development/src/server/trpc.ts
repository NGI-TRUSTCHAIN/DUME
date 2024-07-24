import {initTRPC, TRPCError} from "@trpc/server";
import {Context} from "./context";
import SuperJSON from 'superjson';

const t = initTRPC.context<Context>().create({
    transformer: SuperJSON,
})

const isAuthed = t.middleware(({next, ctx}) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to access this resource',
        });
    }
    return next();
});

export const {mergeRouters, createCallerFactory, router } = t

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);