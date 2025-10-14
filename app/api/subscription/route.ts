import { NextRequest, NextResponse } from "next/server"

import { requireUser } from "@/lib/middleware/auth"
import { getUserSubscriptionByProduct } from "@/services/order-item/actions"
import { cancelSubscription } from "@/services/stripe/actions"
import { createPaymentLink } from "@/services/stripe/checkout-actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CHECKOUT_ERROR, PRODUCT_ERROR, SUBSCRIPTION_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

// GET: サブスクリプション状況の確認
export async function GET(request: NextRequest) {
    const { userId } = await requireUser();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
        return NextResponse.json(
            { message: PRODUCT_ERROR.NOT_FOUND_IDS }, 
            { status: 400 }
        );
    }

    const result = await getUserSubscriptionByProduct({
        productId,
        userId
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

// POST: サブスクリプションの支払いリンクの作成
export async function POST(request: NextRequest) {
    const { user } = await requireUser();
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

    const result = await createPaymentLink({ 
        lineItems, 
        userId,
        userEmail,
        interval
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

// DELETE: サブスクリプションのキャンセル
export async function DELETE(request: NextRequest) {
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
        return NextResponse.json(
            { message: SUBSCRIPTION_ERROR.NO_SUBSCRIPTION_ID }, 
            { status: 400 }
        )
    }

    const result = await cancelSubscription({
        subscriptionId
    });

    if (!result.success) {
        return NextResponse.json(
            { message: result.error }, 
            { status: result.status }
        )
    }

    return NextResponse.json({ success: true });
}