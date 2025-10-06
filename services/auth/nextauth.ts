import bcrypt from "bcryptjs"

import { getUserRepository } from "@/repository/user"
import { LoginCredentials, AccessControlParams } from "next-auth"
import { SITE_MAP } from "@/constants/index"

const { 
    ACCOUNT_PATH, 
    LOGIN_PATH, 
    CREATE_ACCOUNT_PATH, 
    RESET_PASSWORD_PATH,
    CART_PATH
} = SITE_MAP;

// ユーザー認証
export const authenticateUser = async (credentials: LoginCredentials) => {
    if (!credentials) return null;
    
    const repository = getUserRepository();
    const user = await repository.getUserByEmail({
        email: credentials.email as string
    })

    if (!user || !user.password) return null;

    const isPasswordValid = await bcrypt.compare(
        credentials.password as string, 
        user.password
    )

    if (!isPasswordValid) return null;

    return {
        id: user.id, 
        email: user.email,
        name: `${user.user_profiles?.lastname} ${user.user_profiles?.firstname}`,
    }
}

// アクセス制御
export const createAccessControlCallback = () => {
    return ({ auth, request: { nextUrl } }: AccessControlParams) => {
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
    }
}