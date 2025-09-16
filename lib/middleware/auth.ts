import { NextRequest, NextResponse } from "next/server"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { SITE_MAP } from "@/constants/index"
import type { User } from "next-auth"

const { LOGIN_PATH } = SITE_MAP;

interface ServerAuthResult {
    session: Session;
    user: User;
    userId: UserId;
}

interface ActionAuthResult<T> {
    success: boolean;
    error?: string;
    data?: T;
    timestamp?: number;
    user?: User;
    userId?: UserId;
}

export async function requireApiAuth(
    request: NextRequest,
    message: string
): Promise<{ userId: UserId }> {
    const session = await auth();

    if (!session?.user?.id) {
        throw new NextResponse(
            JSON.stringify({ message: message }), 
            { status: 401 }
        );
    }

    return {
        userId: session.user.id as UserId
    }
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