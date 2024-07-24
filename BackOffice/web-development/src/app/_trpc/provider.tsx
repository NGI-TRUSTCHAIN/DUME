'use client'

import React, {useState} from "react";
import {trpc} from "./client";
import {httpBatchLink, httpLink, loggerLink} from "@trpc/client";
import superjson from 'superjson';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

export const TrpcProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                          children,
                                                                      }) => {

    const [queryClient] = useState(() => new QueryClient({}));

    const url = process.env.PUBLIC_URL
        ? `https://${process.env.PUBLIC_URL}`
        : 'http://localhost:3000';

    const [trpcClient] = useState(() =>
            trpc.createClient({
                links: [
                    loggerLink({
                        enabled: () => true,
                    }),
                    // httpLink({
                    //         url: `${url}/api/trpc/`,
                    //         transformer: superjson
                    //     }
                    // )
                    httpBatchLink({
                            url: `${url}/api/trpc/`,
                            transformer: superjson,
                        }
                    )
                ],
            })
        )
    ;
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    )
};