import { NextRequest, NextResponse } from "next/server"

import { requireUser } from "@/lib/middleware/auth"
import { createCheckoutSession } from "@/services/stripe/actions"
import { CHECKOUT_INITIAL_QUANTITY } from "@/constants/index"
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

    try {
        // 商品の合計数量を計算
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, CHECKOUT_INITIAL_QUANTITY);

        // チェックアウトの商品リストを作成
        let lineItems: CheckoutLineItem[] = [];

        for (const cartItem of cartItems) {
            const product = cartItem.product;

            if (!product) {
                return NextResponse.json(
                    { message: CHECKOUT_ERROR.NO_CART_ITEMS }, 
                    { status: 404 }
                );
            }

            const priceId = product.product_stripes?.sale_price_id || product.product_stripes?.regular_price_id;

            if (!priceId) {
                return NextResponse.json(
                    { message: CHECKOUT_ERROR.NO_PRICE_ID }, 
                    { status: 404 }
                );
            }

            lineItems = [...lineItems, {
                price: priceId,
                quantity: cartItem.quantity,
            }];
        }

        try {
            // チェックアウトセッションを作成
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
            console.error('API Error - Create Checkout Session error:', error);

            return NextResponse.json(
                { message: CHECKOUT_ERROR.CHECKOUT_SESSION_FAILED }, 
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('API Error - Process Checkout error:', error);

        return NextResponse.json(
            { message: CHECKOUT_ERROR.CHECKOUT_PRODUCT_CREATE_FAILED }, 
            { status: 500 }
        );
    }
}