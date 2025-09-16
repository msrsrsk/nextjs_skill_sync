import { NextRequest, NextResponse } from "next/server"

import { requireApiAuth } from "@/lib/middleware/auth"
import { getCartItemsData } from "@/lib/database/prisma/actions/cartItems"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_ERROR, CART_ITEM_ERROR } = ERROR_MESSAGES;

export async function GET(request: NextRequest) {
    try {
        // throw new Error('test error');

        const authResult = await requireApiAuth(
            request, 
            USER_ERROR.UNAUTHORIZED
        )

        if (!authResult.isAuthorized) {
            return authResult.response;
        }

        const cartItemsResult = await getCartItemsData({
            userId: authResult.userId!
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