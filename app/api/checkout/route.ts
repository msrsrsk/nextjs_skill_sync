import { NextRequest, NextResponse } from "next/server"

import { requireUser } from "@/lib/middleware/auth"
import { processCheckoutItems } from "@/services/stripe/checkout-actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CHECKOUT_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
    const { userId } = await requireUser();

    const { cartItems, clientCalculatedTotal } = await request.json();

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return NextResponse.json(
            { message: CHECKOUT_ERROR.NO_CART_ITEMS }, 
            { status: 400 }
        )
    }

    try {
        const result = await processCheckoutItems({
            userId,
            cartItems,
            clientCalculatedTotal
        });

        if (!result.success) {
            if (result.error === CHECKOUT_ERROR.NO_PRODUCT_DATA || 
                result.error === CHECKOUT_ERROR.NO_PRICE_ID) {
                return NextResponse.json(
                    { message: result.error }, 
                    { status: 404 }
                )
            }

            return NextResponse.json(
                { message: result.error }, 
                { status: 500 }
            )
        }

        return NextResponse.json({ 
            success: true, 
            data: result.data 
        })
    } catch (error) {
        console.error('Checkout API : Error in processCheckoutItems:', error);

        return NextResponse.json(
            { message: CHECKOUT_ERROR.CHECKOUT_PRODUCT_CREATE_FAILED }, 
            { status: 500 }
        )
    }
}