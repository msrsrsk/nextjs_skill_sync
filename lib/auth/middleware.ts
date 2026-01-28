import NextAuth from "next-auth"

import { getAuthConfig } from "@/lib/auth/config"

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,
    ...getAuthConfig()
})