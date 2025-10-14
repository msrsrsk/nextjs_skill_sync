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

    const result = productId 
        ? await getUserBookmark({ userId, productId }) 
        : await getUserAllBookmarks({ userId })

    if (!result.success) {
        return NextResponse.json(
            { message: result.error }, 
            { status: result.status }
        )
    }

    return NextResponse.json({
        success: true,
        data: result.data
    })
}

// POST: お気に入り状態の変更
export async function POST(request: NextRequest) {
    const { userId } = await requireUser();
    const { productId } = await request.json();

    if (!productId) {
        return NextResponse.json(
            { message: BOOKMARK_ERROR.ADD_MISSING_DATA }, 
            { status: 400 }
        );
    }

    const result = await addBookmark({ 
        userId, 
        productId 
    })

    if (!result.success) {
        return NextResponse.json(
            { message: result.error }, 
            { status: result.status }
        )
    }

    return NextResponse.json({
        success: true,
        data: result.isBookmarked
    })
}

// DELETE: お気に入り削除（個別 or 全て）
export async function DELETE(request: NextRequest) {
    const { userId } = await requireUser();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    let result;
    
    if (action === 'all') {
        result = await removeAllBookmarks({ userId });
    } else {
        const { productId } = await request.json();
            
        if (!productId) {
            return NextResponse.json(
                { message: BOOKMARK_ERROR.REMOVE_MISSING_DATA }, 
                { status: 400 }
            )
        }
        
        result = await removeBookmark({ userId, productId });
    }

    if (!result.success) {
        return NextResponse.json(
            { message: result.error }, 
            { status: result.status }
        )
    }

    return NextResponse.json({
        success: true,
        data: result.data
    })
}