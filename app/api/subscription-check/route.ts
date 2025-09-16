import { NextRequest, NextResponse } from "next/server"

import { requireServerAuth } from "@/lib/middleware/auth"
import { getUserSubscriptionByProduct } from "@/lib/services/order/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CHECKOUT_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    const { user } = await requireServerAuth();
    const userId = user?.id as UserId;

    try {
        const { productId } = await request.json();

        const { success, error, data } = await getUserSubscriptionByProduct({
            productId,
            userId
        });

        if (!success) {
            return NextResponse.json(
                { message: error }, 
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            data: data 
        });
    } catch (error) {
        console.error('API Error - Subscription Check error:', error);

        return NextResponse.json(
            { message: CHECKOUT_ERROR.FETCH_SUBSCRIPTION_FAILED }, 
            { status: 500 }
        );
    }
}