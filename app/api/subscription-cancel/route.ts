import { NextRequest, NextResponse } from "next/server"

import { cancelSubscription } from "@/lib/services/stripe/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SUBSCRIPTION_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    try {
        const { subscriptionId } = await request.json();

        const { success, error } = await cancelSubscription(
            subscriptionId
        );

        if (!success) {
            return NextResponse.json(
                { message: error }, 
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error - Subscription Cancel error:', error);

        return NextResponse.json(
            { message: SUBSCRIPTION_ERROR.CANCEL_SUBSCRIPTION_FAILED }, 
            { status: 500 }
        );
    }
}