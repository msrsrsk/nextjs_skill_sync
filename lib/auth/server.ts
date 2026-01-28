import NextAuth from "next-auth"
import prisma from "@/lib/clients/prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { authenticateUser } from "@/services/auth/nextauth"
import { LoginCredentials } from "next-auth"
import { getAuthConfig } from "@/lib/auth/config"

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    ...getAuthConfig({
        authorize: async (credentials) => {
          return await authenticateUser(credentials as LoginCredentials)
        }
    })
})