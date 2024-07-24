import { deserializeUser } from "@/src/server/auth-middleware"
import { appRouter } from "@/src/server/routes/_router"
import { createCallerFactory } from "@/src/server/trpc"


export const trpcServerClient = createCallerFactory(appRouter)(async () =>{
    return await deserializeUser()
})