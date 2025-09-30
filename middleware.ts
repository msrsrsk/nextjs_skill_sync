import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

import { showErrorToast } from "@/components/common/display/Toasts"
import { SITE_MAP } from "@/constants/index"
const { 
    HOME_PATH,
    DELETE_ACCOUNT_PUBLIC_PATH, 
    RESET_PASSWORD_VERIFY_PATH,
    NOT_FOUND_PATH,
    CATEGORY_PATH,
    CATEGORY_ALL_PATH,
    TREND_PATH,
    TREND_ALL_PATH,
    SYNC_LOG_PATH,
    SYNC_LOG_ALL_PATH,
    NOT_AVAILABLE_PATH,
    WEBHOOK_API_PATH,
    BOOKMARK_API_PATH,
    CART_API_PATH,
    CHAT_API_PATH,
    SHIPPING_ADDRESS_API_PATH,
    USER_API_PATH
} = SITE_MAP;
import { ERROR_MESSAGES } from "@/constants/errorMessages"

export default auth((req) => {
    const { pathname, searchParams } = req.nextUrl;

    if (pathname.startsWith(WEBHOOK_API_PATH)) {
        return null;
    }

    const country = req.geo?.country || req.headers.get('x-vercel-ip-country');

    if (country && country !== 'JP') {
        return NextResponse.redirect(new URL(NOT_AVAILABLE_PATH, req.url));
    }

    if (pathname === NOT_AVAILABLE_PATH && country && country === 'JP') {
        return NextResponse.redirect(new URL(HOME_PATH, req.url));
    }

    const protectedApiRoutes = [
        BOOKMARK_API_PATH,
        CART_API_PATH,
        CHAT_API_PATH,
        SHIPPING_ADDRESS_API_PATH,
        USER_API_PATH
    ]

    const isProtectedApiRoute = protectedApiRoutes.some(route => 
        pathname.startsWith(route)
    )

    if (isProtectedApiRoute) {
        if (!req.auth?.user?.id) {
            showErrorToast(ERROR_MESSAGES.AUTH_ERROR.USER_NOT_FOUND);
            return NextResponse.redirect(new URL(NOT_FOUND_PATH, req.url));
        }
    }

    if (pathname === DELETE_ACCOUNT_PUBLIC_PATH) {
        const token = searchParams.get('token');
        
        if (token !== 'success') {
            return NextResponse.redirect(new URL(NOT_FOUND_PATH, req.url));
        }
    }

    if (pathname === RESET_PASSWORD_VERIFY_PATH) {
        const token = searchParams.get('token');
        
        if (token !== 'success') {
            return NextResponse.redirect(new URL(NOT_FOUND_PATH, req.url));
        }
    }

    if (pathname === CATEGORY_PATH) {
        return NextResponse.redirect(new URL(CATEGORY_ALL_PATH, req.url));
    }

    if (pathname === TREND_PATH) {
        return NextResponse.redirect(new URL(TREND_ALL_PATH, req.url));
    }

    if (pathname === SYNC_LOG_PATH) {
        return NextResponse.redirect(new URL(SYNC_LOG_ALL_PATH, req.url));
    }

    return null;
});

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ]
};