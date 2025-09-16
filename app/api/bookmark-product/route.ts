import { NextRequest, NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { getUserProductBookmarksData } from "@/lib/database/prisma/actions/bookmarks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BOOKMARK_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
    try {
        // throw new Error('test error');

        const session = await auth();
        const userId = session?.user?.id as UserId;

        if (!userId) {
            return NextResponse.json({ 
                success: true, 
                data: false 
            });
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json(
                { message: BOOKMARK_ERROR.NO_PRODUCT_ID }, 
                { status: 400 }
            );
        }

        const isBookmarked = await getUserProductBookmarksData({
            userId: userId as UserId,
            productId: productId
        });

        if (!isBookmarked) {
            return NextResponse.json(
                { message: BOOKMARK_ERROR.FETCH_PRODUCT_FAILED }, 
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            data: isBookmarked 
        });
    } catch (error) {
        console.error('API Error - Bookmark Product GET error:', error);

        return NextResponse.json(
            { message: BOOKMARK_ERROR.FETCH_PRODUCT_FAILED }, 
            { status: 500 }
        );
    }
}