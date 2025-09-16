import { NextRequest, NextResponse } from "next/server"

import { requireApiAuth } from "@/lib/middleware/auth"
import { addBookmark, removeBookmark, removeAllBookmarks } from "@/lib/services/bookmark/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BOOKMARK_ERROR } = ERROR_MESSAGES;

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