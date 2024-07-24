import {NextRequest} from "next/server";
import {fetchRequestHandler} from "@trpc/server/adapters/fetch";
import {appRouter} from "@/src/server/routes/_router";
import {createContext} from "@/src/server/context";


const handler = (req: NextRequest) => {
    console.log(`incoming request ${req.url}`);
    return (
        fetchRequestHandler({
            endpoint: 'api/trpc',
            req,
            router: appRouter,
            createContext: createContext
        })
    )
}

export {handler as GET, handler as POST}