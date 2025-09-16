import { NextRequest, NextResponse } from "next/server"

import { requireServerAuth } from "@/lib/middleware/auth"
import { createPaymentLink } from "@/lib/services/stripe/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CHECKOUT_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
    const { user } = await requireServerAuth();
    const userId = user?.id as UserId;
    const userEmail = user?.email as UserEmail;

    try {
        const { subscriptionPriceId, interval } = await request.json();

        if (!subscriptionPriceId) {
            return NextResponse.json(
                { message: CHECKOUT_ERROR.NO_SUBSCRIPTION_PRICE }, 
                { status: 400 }
            )
        }

        const lineItems = [
            {
                price: subscriptionPriceId,
                quantity: 1,
            }
        ];

        const { success, data } = await createPaymentLink({ 
            lineItems, 
            userId,
            userEmail,
            interval
        });

        if (!success) {
            return NextResponse.json(
                { message: CHECKOUT_ERROR.PAYMENT_LINK_FAILED }, 
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            data: data 
        });
    } catch (error) {
        console.error('API Error - Subscription Checkout error:', error);

        return NextResponse.json(
            { message: CHECKOUT_ERROR.PAYMENT_LINK_FAILED }, 
            { status: 500 }
        );
    }
}