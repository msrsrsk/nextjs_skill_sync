import NextAuth from "next-auth"

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            email: string
            name: string
        }
        error?: string 
    }

    interface LoginCredentials {
        email: string;
        password: string;
    }

    interface NextAuthUser {
        id: string
        email: string
        name: string
    }

    interface AccessControlParams {
        auth: {
            user?: {
                id: string
                email: string
                name: string
            } | null
        } | null
        request: {
            nextUrl: URL
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
        error?: string 
    }
}