import { NextRequest, NextResponse } from "next/server"

import { requireServerAuth } from "@/lib/middleware/auth"
import { createCheckoutSession } from "@/lib/services/stripe/actions"
import { CHECKOUT_INITIAL_QUANTITY } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CHECKOUT_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
    const { userId } = await requireServerAuth();

    try {
        const { cartItems } = await request.json();

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return NextResponse.json(
                { message: CHECKOUT_ERROR.NO_CART_ITEMS }, 
                { status: 400 }
            )
        }

        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, CHECKOUT_INITIAL_QUANTITY);

        let lineItems: CheckoutLineItem[] = [];

        for (const cartItem of cartItems) {
            const product = cartItem.product;

            if (!product) {
                return NextResponse.json(
                    { message: CHECKOUT_ERROR.NO_CART_ITEMS }, 
                    { status: 400 }
                );
            }

            const priceId = product.stripe_sale_price_id || product.stripe_regular_price_id;

            if (!priceId) {
                return NextResponse.json(
                    { message: CHECKOUT_ERROR.NO_PRICE_ID }, 
                    { status: 500 }
                );
            }

            lineItems = [...lineItems, {
                price: priceId,
                quantity: cartItem.quantity,
            }];
        }

        const { success, data } = await createCheckoutSession({ 
            lineItems, 
            userId,
            totalQuantity,
        });

        if (!success) {
            return NextResponse.json(
                { message: CHECKOUT_ERROR.CHECKOUT_SESSION_FAILED }, 
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            data: data 
        });
    } catch (error) {
        console.error('API Error - Checkout POST error:', error);

        return NextResponse.json(
            { message: CHECKOUT_ERROR.CHECKOUT_SESSION_FAILED }, 
            { status: 500 }
        );
    }
}