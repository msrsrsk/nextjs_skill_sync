import { NextRequest, NextResponse } from "next/server"

import { requireUserId, requireServerAuth } from "@/lib/middleware/auth"
import { getUserSubscriptionByProduct } from "@/services/order/actions"
import { createPaymentLink, cancelSubscription } from "@/services/stripe/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CHECKOUT_ERROR, PRODUCT_ERROR, SUBSCRIPTION_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

// GET: サブスクリプション状況の確認
export async function GET(request: NextRequest) {
    const { userId } = await requireUserId();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
        return NextResponse.json(
            { message: PRODUCT_ERROR.NOT_FOUND_IDS }, 
            { status: 400 }
        );
    }

    try {
        const { success, error, data } = await getUserSubscriptionByProduct({
            productId,
            userId
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
        console.error('API Error - Get Subscription Data error:', error);

        return NextResponse.json(
            { message: CHECKOUT_ERROR.FETCH_SUBSCRIPTION_FAILED }, 
            { status: 500 }
        );
    }
}

// POST: サブスクリプションの支払いリンクの作成
export async function POST(request: NextRequest) {
    const { user } = await requireServerAuth();
    const userId = user?.id as UserId;
    const userEmail = user?.email as UserEmail;

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
    ]

    try {
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
        console.error('API Error - Create Payment Link error:', error);

        return NextResponse.json(
            { message: CHECKOUT_ERROR.PAYMENT_LINK_FAILED }, 
            { status: 500 }
        );
    }
}

// DELETE: サブスクリプションのキャンセル
export async function DELETE(request: NextRequest) {
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
        return NextResponse.json(
            { message: SUBSCRIPTION_ERROR.NO_SUBSCRIPTION_ID }, 
            { status: 400 }
        );
    }

    try {
        const { success, error } = await cancelSubscription({
            subscriptionId
        });

        if (!success) {
            return NextResponse.json(
                { message: error }, 
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error - Cancel Subscription error:', error);

        return NextResponse.json(
            { message: SUBSCRIPTION_ERROR.CANCEL_SUBSCRIPTION_FAILED }, 
            { status: 500 }
        );
    }
}