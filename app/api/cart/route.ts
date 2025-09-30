import { NextRequest, NextResponse } from "next/server"

import { requireApiAuth } from "@/lib/middleware/auth"
import { 
    getCartItemsData, 
    getCartItemsByProductIdData 
} from "@/lib/database/prisma/actions/cartItems"
import { 
    createCartItems, 
    updateCartItemQuantity,
    deleteCartItems, 
    deleteAllCartItems 
} from "@/lib/services/cart-item/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_ERROR, CART_ITEM_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

// GET: カートのデータを取得
export async function GET(request: NextRequest) {
    try {
        // throw new Error('test error');

        const { userId } = await requireApiAuth(
            request, 
            USER_ERROR.UNAUTHORIZED
        )

        const cartItemsResult = await getCartItemsData({
            userId: userId as UserId
        });

        if (!cartItemsResult) {
            return NextResponse.json(
                { message: CART_ITEM_ERROR.FETCH_FAILED }, 
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            data: cartItemsResult 
        });
    } catch (error) {
        console.error('API Error - Cart Data GET error:', error);

        return NextResponse.json(
            { message: CART_ITEM_ERROR.FETCH_FAILED }, 
            { status: 500 }
        );
    }
}

// POST: カートに商品を追加
export async function POST(request: NextRequest) {
    try {
        const { userId } = await requireApiAuth(
            request, 
            CART_ITEM_ERROR.UNAUTHORIZED
        );

        const { productId, quantity } = await request.json();

        if (!productId || !quantity) {
            return NextResponse.json(
                { message: CART_ITEM_ERROR.NO_PRODUCT_DATA }, 
                { status: 400 }
            );
        }

        // カートに商品が既にあるか確認
        const checkCartItem = await getCartItemsByProductIdData({
            userId: userId as UserId,
            productId: productId
        });
        
        if (checkCartItem) {
            const newQuantity = checkCartItem.quantity + quantity;

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
        }

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
        console.error('API Error - Cart Items POST error:', error);

        return NextResponse.json(
            { message: CART_ITEM_ERROR.CREATE_FAILED }, 
            { status: 500 }
        );
    }
}

// PUT: カートの商品数量を更新
export async function PUT(request: NextRequest) {
    try {
        const { userId } = await requireApiAuth(
            request, 
            CART_ITEM_ERROR.UNAUTHORIZED
        );

        const { productId, quantity } = await request.json();

        if (!productId || !quantity) {
            return NextResponse.json(
                { message: CART_ITEM_ERROR.NO_PRODUCT_DATA }, 
                { status: 400 }
            );
        }

        const { success, error } = await updateCartItemQuantity({
            userId: userId as UserId,
            productId,
            quantity
        });

        if (!success) {
            return NextResponse.json(
                { message: error }, 
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            success: true, 
        });
    } catch (error) {
        console.error('API Error - Cart Quantity POST error:', error);

        return NextResponse.json(
            { message: CART_ITEM_ERROR.UPDATE_QUANTITY_FAILED }, 
            { status: 500 }
        );
    }
}

// DELETE: カートの商品を削除
export async function DELETE(request: NextRequest) {
    try {
        const { userId } = await requireApiAuth(
            request, 
            CART_ITEM_ERROR.UNAUTHORIZED
        );

        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        if (action === 'all') {
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
        } else {
            const { productId } = await request.json();
    
            if (!productId) {
                return NextResponse.json(
                    { message: CART_ITEM_ERROR.NO_PRODUCT_DATA }, 
                    { status: 400 }
                );
            }
    
            const { success, error, data } = await deleteCartItems({
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
                data: data 
            });
        }
    } catch (error) {
        console.error('API Error - Cart Items DELETE error:', error);

        return NextResponse.json(
            { message: CART_ITEM_ERROR.DELETE_FAILED }, 
            { status: 500 }
        );
    }
}