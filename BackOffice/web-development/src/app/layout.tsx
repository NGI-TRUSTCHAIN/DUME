import React from "react";
import { AuthProvider } from "@/src/lib/auth/session-provider";
import {TrpcProvider} from "@/src/app/_trpc/provider";
import {StyleProvider} from "@/src/styles/theme-provider";


export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body style={{margin: 0, padding: 0}}>
        <AuthProvider>
            <TrpcProvider>
                <StyleProvider>
                    {children}
                </StyleProvider>
            </TrpcProvider>
        </AuthProvider>
        </body>
        </html>
    )
}
