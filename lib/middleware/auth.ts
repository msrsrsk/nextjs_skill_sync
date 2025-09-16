import { NextRequest, NextResponse } from "next/server"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { SITE_MAP } from "@/constants/index"
import { NextAuthUser } from "next-auth"

const { LOGIN_PATH } = SITE_MAP;


interface AuthResult {
    isAuthorized: boolean;
    userId?: UserId;
    response?: NextResponse;
}

interface ServerAuthResult {
    session: Session;
    user: NextAuthUser;
    userId: UserId;
}

interface ActionAuthResult<T> {
    success: boolean;
    error?: string;
    data?: T;
    timestamp?: number;
    user?: NextAuthUser;
    userId?: UserId;
}

export async function requireApiAuth(
    request: NextRequest,
    message: string
): Promise<AuthResult> {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            isAuthorized: false,
            response: NextResponse.json(
                { message: message }, 
                { status: 401 }
            )
        };
    }

    return {
        isAuthorized: true,
        userId: session.user.id as UserId
    };
}

export async function requireServerAuth(): Promise<ServerAuthResult> {
    const session = await auth();

    if (!session?.user) {
        redirect(LOGIN_PATH);
    }

    return {
        session,
        user: session.user,
        userId: session.user.id as UserId
    };
}

export async function actionAuth<T>(
    message: string,
    isDataRequired: boolean = false
): Promise<ActionAuthResult<T>> {
    const session = await auth();
    
    if (!session?.user) {
        if (isDataRequired) {
            return {
                success: false,
                error: message,
                data: null as T,
                timestamp: Date.now()
            };
        }

        return {
            success: false,
            error: message,
            timestamp: Date.now()
        };
    }

    return {
        success: true,
        user: session.user,
        userId: session.user.id as UserId
    };
}