import { NextRequest, NextResponse } from "next/server"

import { requireUser } from "@/lib/middleware/auth"
import { 
    createCartItems,
    getCartItemByProduct, 
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

    try {
        const { data } = await getCartItems({ userId });
    
        return NextResponse.json({ 
            success: true, 
            data: data 
        })
    } catch (error) {
        console.error('Database : Error in getCartItems: ', error);

        return NextResponse.json(
            { message: CART_ITEM_ERROR.FETCH_FAILED }, 
            { status: 500 }
        )
    }
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

    try {
        const { data: existingCartItem } = await getCartItemByProduct({
            userId,
            productId
        });

        if (existingCartItem) {
            const newQuantity = existingCartItem.quantity + quantity;
    
            const { success, data } = await updateCartItemQuantity({
                userId,
                productId,
                quantity: newQuantity
            })

            if (!success) {
                return NextResponse.json(
                    { message: CART_ITEM_ERROR.UPDATE_QUANTITY_FAILED }, 
                    { status: 404 }
                )
            }

            return NextResponse.json({ 
                success: true, 
                data: data 
            })
        } else {
            const { success, data } = await createCartItems({
                cartItemsData: {
                    user_id: userId,
                    product_id: productId,
                    quantity,
                    created_at: new Date()
                } as CartItem
            })

            if (!success) {
                return NextResponse.json(
                    { message: CART_ITEM_ERROR.CREATE_FAILED }, 
                    { status: 500 }
                )
            }

            return NextResponse.json({ 
                success: true, 
                data: data 
            })
        }
    } catch (error) {
        console.error('Database : Error in updateCartItemQuantity or createCartItems: ', error);

        return NextResponse.json(
            { message: CART_ITEM_ERROR.ADD_FAILED }, 
            { status: 500 }
        )
    }
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

    try {
        const { success, data } = await updateCartItemQuantity({
            userId,
            productId,
            quantity
        });
    
        if (!success) {
            return NextResponse.json(
                { message: CART_ITEM_ERROR.UPDATE_QUANTITY_FAILED }, 
                { status: 404 }
            )
        }
    
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Database : Error in updateCartItemQuantity: ', error);

        return NextResponse.json(
            { message: CART_ITEM_ERROR.UPDATE_QUANTITY_FAILED }, 
            { status: 500 }
        )
    }
}

// DELETE: カートの商品を削除
export async function DELETE(request: NextRequest) {
    const { userId } = await requireUser();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    try {
        if (action === 'all') {
            const { success, data } = await deleteAllCartItems({ userId });

            if (!success) {
                return NextResponse.json(
                    { message: CART_ITEM_ERROR.DELETE_ALL_FAILED }, 
                    { status: 500 }
                )
            }

            return NextResponse.json({ 
                success: true, 
                data: data 
            })
        } else {
            const { productId } = await request.json();
    
            if (!productId) {
                return NextResponse.json(
                    { message: CART_ITEM_ERROR.NO_PRODUCT_DATA }, 
                    { status: 400 }
                )
            }
    
            const { success, data } = await deleteCartItems({ userId, productId });

            if (!success) {
                return NextResponse.json(
                    { message: CART_ITEM_ERROR.DELETE_FAILED }, 
                    { status: 404 }
                )
            }
            
            return NextResponse.json({ 
                success: true, 
                data: data 
            })
        }
    } catch (error) {
        console.error(`Database : Error in ${
            action === 'all' ? 'deleteAllCartItems' : 'deleteCartItems'
        }: `, error);

        return NextResponse.json(
            { message: CART_ITEM_ERROR.DELETE_FAILED }, 
            { status: 500 }
        )
    }
}