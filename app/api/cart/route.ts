import { NextRequest, NextResponse } from "next/server"

import { requireUser } from "@/lib/middleware/auth"
import { getCartItemRepository } from "@/repository/cartItem"
import { 
    createCartItems, 
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
        // throw new Error('test error');

        const repository = getCartItemRepository();
        const cartItemsResult = await repository.getCartItems({
            userId: userId as UserId
        });

        return NextResponse.json({ 
            success: true, 
            data: cartItemsResult || []
        });
    } catch (error) {
        console.error('API Error - Get Cart Data error:', error);

        return NextResponse.json(
            { message: CART_ITEM_ERROR.FETCH_FAILED }, 
            { status: 500 }
        );
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
        );
    }

    try {
        // カートに商品が既にあるか確認
        const repository = getCartItemRepository();
        const checkCartItem = await repository.getCartItemByProductId({
            userId: userId as UserId,
            productId: productId
        });
        
        if (checkCartItem) {
            const newQuantity = checkCartItem.quantity + quantity;

            try {
                const { 
                    success: updateSuccess, 
                    error: updateError, 
                    data: updateData 
                } = await updateCartItemQuantity({
                    userId: userId as UserId,
                    productId: productId,
                    quantity: newQuantity
                });
    
                if (!updateSuccess) {
                    return NextResponse.json(
                        { message: updateError }, 
                        { status: 500 }
                    );
                }
    
                return NextResponse.json({ 
                    success: true, 
                    data: updateData 
                });
            } catch (error) {
                console.error('API Error - Update Cart Item Quantity error:', error);

                return NextResponse.json(
                    { message: CART_ITEM_ERROR.UPDATE_QUANTITY_FAILED }, 
                    { status: 500 }
                );
            }
        }

        try {
            // カートに商品がなければ追加
            const { 
                success: createSuccess, 
                error: createError, 
                data: createData 
            } = await createCartItems({
                cartItemsData: {
                    user_id: userId as UserId,
                    product_id: productId,
                    quantity: quantity,
                    created_at: new Date(),
                } as CartItem
            });
    
            if (!createSuccess) {
                return NextResponse.json(
                    { message: createError }, 
                    { status: 500 }
                );
            }
    
            return NextResponse.json({ 
                success: true, 
                data: createData 
            });
        } catch (error) {
            console.error('API Error - Create Cart Items error:', error);

            return NextResponse.json(
                { message: CART_ITEM_ERROR.CREATE_FAILED }, 
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('API Error - Add Cart Items error:', error);

        return NextResponse.json(
            { message: CART_ITEM_ERROR.FETCH_FAILED }, 
            { status: 500 }
        );
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
        );
    }

    try {
        const { success, error } = await updateCartItemQuantity({
            userId: userId as UserId,
            productId,
            quantity
        });

        if (!success) {
            return NextResponse.json(
                { message: error }, 
                { status: 404 }
            );
        }

        return NextResponse.json({ 
            success: true, 
        });
    } catch (error) {
        console.error('API Error - Update Cart Item Quantity error:', error);

        return NextResponse.json(
            { message: CART_ITEM_ERROR.UPDATE_QUANTITY_FAILED }, 
            { status: 500 }
        );
    }
}

// DELETE: カートの商品を削除
export async function DELETE(request: NextRequest) {
    const { userId } = await requireUser();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'all') {
        try {
            const { success, error, data } = await deleteAllCartItems({
                userId: userId as UserId
            });

            if (!success) {
                return NextResponse.json(
                    { message: error }, 
                    { status: 500 }
                );
            }

            return NextResponse.json({ 
                success: true, 
                data: data 
            });
        } catch (error) {
            console.error('API Error - Delete All Cart Items error:', error);

            return NextResponse.json(
                { message: CART_ITEM_ERROR.DELETE_ALL_FAILED }, 
                { status: 500 }
            );
        }
    } else {
        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json(
                { message: CART_ITEM_ERROR.NO_PRODUCT_DATA }, 
                { status: 400 }
            );
        }

        try {
            const { success, error, data } = await deleteCartItems({
                userId: userId as UserId,
                productId
            });
    
            if (!success) {
                return NextResponse.json(
                    { message: error }, 
                    { status: 404 }
                );
            }
    
            return NextResponse.json({ 
                success: true, 
                data: data 
            });
        } catch (error) {
            console.error('API Error - Delete Cart Items error:', error);

            return NextResponse.json(
                { message: CART_ITEM_ERROR.DELETE_FAILED }, 
                { status: 500 }
            );
        }
    }
}