import { NextRequest, NextResponse } from "next/server"

import { requireApiAuth } from "@/lib/middleware/auth"
import { getUserBookmarksData } from "@/lib/database/prisma/actions/bookmarks"
import { BOOKMARK_PAGE_DISPLAY_LIMIT } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_ERROR, BOOKMARK_ERROR } = ERROR_MESSAGES;

export async function GET(request: NextRequest) {
    try {
        // throw new Error('test error');

        const { userId } = await requireApiAuth(
            request, 
            USER_ERROR.UNAUTHORIZED
        )

        const bookmarkItemsResult = await getUserBookmarksData({
            userId: userId as UserId,
            limit: BOOKMARK_PAGE_DISPLAY_LIMIT
        });

        if (!bookmarkItemsResult) {
            return NextResponse.json(
                { message: BOOKMARK_ERROR.FETCH_FAILED }, 
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            data: bookmarkItemsResult 
        });
    } catch (error) {
        console.error('API Error - Bookmark Data GET error:', error);

        return NextResponse.json(
            { message: BOOKMARK_ERROR.FETCH_FAILED }, 
            { status: 500 }
        );
    }
}