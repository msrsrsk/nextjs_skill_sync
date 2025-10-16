import { NextRequest, NextResponse } from "next/server"

import { requireUser } from "@/lib/middleware/auth"
import { 
    addBookmark, 
    getUserBookmark,
    getUserAllBookmarks,
    removeBookmark, 
    removeAllBookmarks 
} from "@/services/bookmark/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BOOKMARK_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

// GET: お気に入りデータの取得
export async function GET(request: NextRequest) {
    const { userId } = await requireUser();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    try {
        const { success, data } = productId 
            ? await getUserBookmark({ userId, productId }) 
            : await getUserAllBookmarks({ userId })
    
        if (!success) {
            return NextResponse.json(
                { message: productId 
                    ? BOOKMARK_ERROR.FETCH_PRODUCT_FAILED 
                    : BOOKMARK_ERROR.FETCH_FAILED }, 
                { status: productId ? 404 : 500 }
            )
        }
    
        return NextResponse.json({
            success: true,
            data: data
        })
    } catch (error) {
        console.error(`Database : Error in ${
            productId ? 'getUserBookmark' : 'getUserAllBookmarks'
        }: `, error);

        return NextResponse.json(
            { message: BOOKMARK_ERROR.FETCH_FAILED }, 
            { status: 500 }
        )
    }
}

// POST: お気に入り状態の変更
export async function POST(request: NextRequest) {
    const { userId } = await requireUser();
    const { productId } = await request.json();

    if (!productId) {
        return NextResponse.json(
            { message: BOOKMARK_ERROR.ADD_MISSING_DATA }, 
            { status: 400 }
        )
    }

    try {
        const { success, isBookmarked } = await addBookmark({ 
            userId, 
            productId 
        })
    
        if (!success) {
            return NextResponse.json(
                { message: BOOKMARK_ERROR.ADD_FAILED }, 
                { status: 500 }
            )
        }
    
        return NextResponse.json({
            success: true,
            data: isBookmarked
        })
    } catch (error) {
        console.error('Database : Error in addBookmark: ', error);

        return NextResponse.json(
            { message: BOOKMARK_ERROR.ADD_FAILED }, 
            { status: 500 }
        )
    }
}

// DELETE: お気に入り削除（個別 or 全て）
export async function DELETE(request: NextRequest) {
    const { userId } = await requireUser();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    try {
        if (action === 'all') {
            const { success } = await removeAllBookmarks({ userId });

            if (!success) {
                return NextResponse.json(
                    { message: BOOKMARK_ERROR.REMOVE_ALL_FAILED }, 
                    { status: 500 }
                )
            }
            
            return NextResponse.json({ success: true })
        } else {
            const { productId } = await request.json();
                
            if (!productId) {
                return NextResponse.json(
                    { message: BOOKMARK_ERROR.REMOVE_MISSING_DATA }, 
                    { status: 400 }
                )
            }
            
            const { success, isBookmarked } = await removeBookmark({ 
                userId, 
                productId 
            });

            if (!success) {
                return NextResponse.json(
                    { message: BOOKMARK_ERROR.REMOVE_FAILED }, 
                    { status: 500 }
                )
            }
            
            return NextResponse.json({ 
                success: true, 
                data: isBookmarked 
            })
        }
    } catch (error) {
        console.error('Database : Error in removeBookmark: ', error);

        return NextResponse.json(
            { message: BOOKMARK_ERROR.REMOVE_FAILED }, 
            { status: 500 }
        )
    }
}