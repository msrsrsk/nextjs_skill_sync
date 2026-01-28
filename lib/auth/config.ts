import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

import { createAccessControlCallback } from "@/services/auth/nextauth"
import { SITE_MAP, SESSION_MAX_AGE } from "@/constants/index"

const { LOGIN_PATH } = SITE_MAP;

export const getAuthConfig = (options?: {
    authorize?: (credentials: any) => Promise<any> | null
}): NextAuthConfig => ({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                return options?.authorize ? await options.authorize(credentials) : null
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