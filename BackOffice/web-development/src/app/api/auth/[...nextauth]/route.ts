import NextAuth, {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import { compare } from 'bcrypt'
import {prisma} from "@/src/lib/database/prisma";

export const authConfig: NextAuthOptions = {

    pages: {
        signIn: '/login',
    },

    session: {
        strategy: 'jwt'
    },

    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, forgot-password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user) {
                    return null
                }

                // User is not active, tell them to activate-account
                if (!user.active) {
                    throw new Error('User is not active')
                }

                const isPasswordValid = await compare(
                    credentials.password,
                    user.password
                )

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id + '',
                    email: user.email,
                    name: user.name,
                    randomKey: 'Hey you'
                }

            }
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),

        // AppleProvider({
        //     clientId: process.env.APPLE_ID as string,
        //     clientSecret: process.env.APPLE_SECRET as string
        // })


    ],

    callbacks: {
        session: ({ session, token }) => {
            // console.log('Session Callback', { session, token })
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    randomKey: token.randomKey
                }
            }
        },
        jwt: ({ token, user }) => {
            // console.log('JWT Callback', { token, users })
            if (user) {
                const u = user as unknown as any
                return {
                    ...token,
                    id: u.id,
                    randomKey: u.randomKey
                }
            }
            return token
        }
    }
}


const handler = NextAuth(authConfig)
export { handler as GET, handler as POST}