import { NextRequest, NextResponse } from "next/server"

import { requireApiAuth } from "@/lib/middleware/auth"
import { 
    addBookmark, 
    removeBookmark, 
    removeAllBookmarks 
} from "@/lib/services/bookmark/actions"
import { 
    getUserProductBookmarksData, 
    getUserBookmarksData 
} from "@/lib/database/prisma/actions/bookmarks"
import { BOOKMARK_PAGE_DISPLAY_LIMIT } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_ERROR, BOOKMARK_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

// GET: お気に入りデータの取得
export async function GET(request: NextRequest) {
    try {
        // throw new Error('test error');

        const { userId } = await requireApiAuth(
            request, 
            USER_ERROR.UNAUTHORIZED
        )

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (productId) {
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
        } else {
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
        }
    } catch (error) {
        console.error('API Error - Bookmark GET error:', error);

        return NextResponse.json(
            { message: BOOKMARK_ERROR.FETCH_FAILED }, 
            { status: 500 }
        );
    }
}

// POST: お気に入り状態の変更
export async function POST(request: NextRequest) {
    try {
        const { userId } = await requireApiAuth(
            request, 
            BOOKMARK_ERROR.ADD_UNAUTHORIZED
        );

        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json(
                { message: BOOKMARK_ERROR.ADD_MISSING_DATA }, 
                { status: 400 }
            );
        }

        const { success, error, isBookmarked } = await addBookmark({ 
            userId: userId as UserId, 
            productId 
        });

        if (!success) {
            return NextResponse.json(
                { message: error }, 
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            data: isBookmarked 
        });
    } catch (error) {
        console.error('API Error - Bookmark POST error:', error);

        return NextResponse.json(
            { message: BOOKMARK_ERROR.ADD_FAILED }, 
            { status: 500 }
        );
    }
}

// DELETE: お気に入り削除（個別 or 全て）
export async function DELETE(request: NextRequest) {
    try {
        const { userId } = await requireApiAuth(
            request, 
            BOOKMARK_ERROR.REMOVE_UNAUTHORIZED
        );

        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        if (action === 'all') {
            const { success, error } = await removeAllBookmarks({ 
                userId: userId as UserId 
            });

            if (!success) {
                return NextResponse.json(
                    { message: error }, 
                    { status: 500 }
                );
            }

            return NextResponse.json({ 
                success: true 
            });
        } else {
            const { productId } = await request.json();
            
            if (!productId) {
                return NextResponse.json(
                    { message: BOOKMARK_ERROR.REMOVE_MISSING_DATA }, 
                    { status: 400 }
                );
            }
    
            const { success, error, isBookmarked } = await removeBookmark({
                userId: userId as UserId, 
                productId
            });
    
            if (!success) {
                return NextResponse.json(
                    { message: error }, 
                    { status: 500 }
                );
            }
    
            return NextResponse.json({ 
                success: true, 
                data: isBookmarked 
            });
        }
    } catch (error) {
        console.error('API Error - Bookmark DELETE error:', error);

        return NextResponse.json(
            { message: BOOKMARK_ERROR.REMOVE_FAILED }, 
            { status: 500 }
        );
    }
}