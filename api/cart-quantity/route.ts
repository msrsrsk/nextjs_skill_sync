import { NextRequest, NextResponse } from "next/server"

import { requireApiAuth } from "@/lib/middleware/auth"
import { updateCartItemQuantity } from "@/lib/services/cart-item/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CART_ITEM_ERROR } = ERROR_MESSAGES;

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