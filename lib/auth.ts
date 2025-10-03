import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/clients/prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { authenticateUser, createAccessControlCallback } from "@/services/auth/nextauth"
import { LoginCredentials } from "next-auth"
import { SITE_MAP, SESSION_MAX_AGE } from "@/constants/index"

const { LOGIN_PATH } = SITE_MAP;

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                return await authenticateUser(
                    credentials as LoginCredentials
                )
            }
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: SESSION_MAX_AGE,
    },
    cookies: {
        sessionToken: {
            options: {
                secure: process.env.NODE_ENV === "production",
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                maxAge: SESSION_MAX_AGE,
            }
        }
    },
    jwt: {
        maxAge: SESSION_MAX_AGE,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
            }
            return session
        },
        authorized: createAccessControlCallback()
    },
    pages: {
        signIn: LOGIN_PATH,
    }
})