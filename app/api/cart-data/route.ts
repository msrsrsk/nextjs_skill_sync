import { NextRequest, NextResponse } from "next/server"

import { requireApiAuth } from "@/lib/middleware/auth"
import { getCartItemsData } from "@/lib/database/prisma/actions/cartItems"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_ERROR, CART_ITEM_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic";

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