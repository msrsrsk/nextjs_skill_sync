import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/clients/prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { authenticateUser } from "@/services/auth/actions"
import { LoginCredentials } from "next-auth"
import { SITE_MAP, SESSION_MAX_AGE } from "@/constants/index"

const { 
    ACCOUNT_PATH, 
    LOGIN_PATH, 
    CREATE_ACCOUNT_PATH, 
    RESET_PASSWORD_PATH,
    CART_PATH,
} = SITE_MAP;

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
                if (!credentials) return null;
        
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
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const { pathname } = nextUrl;
            
            if ((pathname.startsWith(ACCOUNT_PATH) || 
                 pathname.startsWith(CART_PATH)) && !isLoggedIn
            ) {
                const redirectUrl = new URL(LOGIN_PATH, nextUrl);
                redirectUrl.searchParams.set('redirectTo', nextUrl.pathname);
                return Response.redirect(redirectUrl);
            }
            if ((pathname.startsWith(ACCOUNT_PATH)) && !isLoggedIn) {
                const redirectUrl = new URL(LOGIN_PATH, nextUrl);
                redirectUrl.searchParams.set('redirectTo', nextUrl.pathname);
                return Response.redirect(redirectUrl);
            }
            
            if (isLoggedIn && (
                pathname === LOGIN_PATH || 
                pathname.includes(CREATE_ACCOUNT_PATH) || 
                pathname.includes(RESET_PASSWORD_PATH)
            )) {
                return Response.redirect(new URL(ACCOUNT_PATH, nextUrl));
            }
            
            return true;
        },
    },
    pages: {
        signIn: LOGIN_PATH,
    }
})