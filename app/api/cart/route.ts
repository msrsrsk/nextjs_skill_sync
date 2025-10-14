import { NextRequest, NextResponse } from "next/server"

import { requireUser } from "@/lib/middleware/auth"
import { 
    addOrUpdateCartItem, 
    getCartItems,
    updateCartItemQuantity,
    deleteCartItems, 
    deleteAllCartItems 
} from "@/services/cart-item/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CART_ITEM_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

// GET: カートのデータを取得
export async function GET(request: NextRequest) {
    const { userId } = await requireUser();

    const result = await getCartItems({ userId });

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

// POST: カートに商品を追加
export async function POST(request: NextRequest) {
    const { userId } = await requireUser();

    const { productId, quantity } = await request.json();

    if (!productId || !quantity) {
        return NextResponse.json(
            { message: CART_ITEM_ERROR.NO_PRODUCT_DATA }, 
            { status: 400 }
        )
    }

    const result = await addOrUpdateCartItem({
        userId,
        productId,
        quantity
    });

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

// PUT: カートの商品数量を更新
export async function PUT(request: NextRequest) {
    const { userId } = await requireUser();

    const { productId, quantity } = await request.json();

    if (!productId || !quantity) {
        return NextResponse.json(
            { message: CART_ITEM_ERROR.NO_PRODUCT_DATA }, 
            { status: 400 }
        )
    }

    const result = await updateCartItemQuantity({
        userId,
        productId,
        quantity
    });

    if (!result.success) {
        return NextResponse.json(
            { message: result.error }, 
            { status: result.status }
        )
    }

    return NextResponse.json({ success: true })
}

// DELETE: カートの商品を削除
export async function DELETE(request: NextRequest) {
    const { userId } = await requireUser();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    let result;

    if (action === 'all') {
        result = await deleteAllCartItems({ userId });
    } else {
        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json(
                { message: CART_ITEM_ERROR.NO_PRODUCT_DATA }, 
                { status: 400 }
            )
        }

        result = await deleteCartItems({ userId, productId })
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