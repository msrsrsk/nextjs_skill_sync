import { NextRequest, NextResponse } from "next/server"

import { requireUser } from "@/lib/middleware/auth"
import { processCheckoutItems } from "@/services/stripe/checkout-actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CHECKOUT_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
    const { userId } = await requireUser();

    const { cartItems } = await request.json();

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return NextResponse.json(
            { message: CHECKOUT_ERROR.NO_CART_ITEMS }, 
            { status: 400 }
        )
    }

    const result = await processCheckoutItems({
        userId,
        cartItems
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