import { NextRequest, NextResponse } from "next/server"

import { requireUserId } from "@/lib/middleware/auth"
import { 
    addBookmark, 
    removeBookmark, 
    removeAllBookmarks 
} from "@/services/bookmark/actions"
import { getUserBookmarkRepository } from "@/repository/bookmark"
import { BOOKMARK_PAGE_DISPLAY_LIMIT } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BOOKMARK_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

// GET: お気に入りデータの取得
export async function GET(request: NextRequest) {
    const { userId } = await requireUserId();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const repository = getUserBookmarkRepository();
    
    if (productId) {
        // throw new Error('test error');

        try {
            const isBookmarked = await repository.getUserProductBookmark({
                userId: userId as UserId,
                productId: productId
            });
    
            if (!isBookmarked) {
                return NextResponse.json(
                    { message: BOOKMARK_ERROR.FETCH_PRODUCT_FAILED }, 
                    { status: 404 }
                );
            }
    
            return NextResponse.json({ 
                success: true, 
                data: isBookmarked 
            });
        } catch (error) {
            console.error('API Error - Get User Product Bookmark error:', error);

            return NextResponse.json(
                { message: BOOKMARK_ERROR.FETCH_FAILED }, 
                { status: 500 }
            );
        }
    } else {
        try {
            const bookmarkItemsResult = await repository.getUserBookmarks({
                userId: userId as UserId,
                limit: BOOKMARK_PAGE_DISPLAY_LIMIT
            });
    
            if (!bookmarkItemsResult) {
                return NextResponse.json(
                    { message: BOOKMARK_ERROR.FETCH_FAILED }, 
                    { status: 404 }
                );
            }
    
            return NextResponse.json({ 
                success: true, 
                data: bookmarkItemsResult 
            });
        } catch (error) {
            console.error('API Error - Get User Bookmarks error:', error);

            return NextResponse.json(
                { message: BOOKMARK_ERROR.FETCH_FAILED }, 
                { status: 500 }
            );
        }
    }
}

// POST: お気に入り状態の変更
export async function POST(request: NextRequest) {
    const { userId } = await requireUserId();
    const { productId } = await request.json();

    if (!productId) {
        return NextResponse.json(
            { message: BOOKMARK_ERROR.ADD_MISSING_DATA }, 
            { status: 400 }
        );
    }

    try {
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
        console.error('API Error - Add Bookmark error:', error);

        return NextResponse.json(
            { message: BOOKMARK_ERROR.ADD_FAILED }, 
            { status: 500 }
        );
    }
}

// DELETE: お気に入り削除（個別 or 全て）
export async function DELETE(request: NextRequest) {
    const { userId } = await requireUserId();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'all') {
        try {
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
        } catch (error) {
            console.error('API Error - Remove All Bookmarks error:', error);

            return NextResponse.json(
                { message: BOOKMARK_ERROR.REMOVE_ALL_FAILED }, 
                { status: 500 }
            );
        }
    } else {
        const { productId } = await request.json();
        
        if (!productId) {
            return NextResponse.json(
                { message: BOOKMARK_ERROR.REMOVE_MISSING_DATA }, 
                { status: 400 }
            );
        }

        try {
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
        } catch (error) {
            console.error('API Error - Remove Bookmark error:', error);

            return NextResponse.json(
                { message: BOOKMARK_ERROR.REMOVE_FAILED }, 
                { status: 500 }
            );
        }
    }
}