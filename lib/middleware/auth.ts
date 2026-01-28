import type { User } from "next-auth"

import { auth } from "@/lib/auth/middleware"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

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

export async function requireUser(): Promise<ServerAuthResult> {
    const session = await auth();

    if (!session?.user) {
        throw new Error(ERROR_MESSAGES.AUTH_ERROR.USER_NOT_FOUND);
    }

    return {
        session,
        user: session.user,
        userId: session.user.id as UserId
    }
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