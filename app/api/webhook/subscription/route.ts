import { NextRequest, NextResponse } from "next/server"

import { verifyWebhookSignature } from "@/lib/utils/webhook"
import { processSubscriptionWebhook } from "@/services/stripe/webhook-actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SUBSCRIPTION_ERROR } = ERROR_MESSAGES;

export async function POST(request: NextRequest) {   
    const endpointSecret = process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET_KEY;

    try {
        const event = await verifyWebhookSignature({
            request,
            endpointSecret: endpointSecret as string,
            errorMessage: SUBSCRIPTION_ERROR.WEBHOOK_PROCESS_FAILED
        });

        const result = await processSubscriptionWebhook({
            event
        });

        if (!result.success) {
            return NextResponse.json(
                { message: result.error }, 
                { status: result.status }
            )
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook Error - Stripe Subscription POST error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : SUBSCRIPTION_ERROR.WEBHOOK_PROCESS_FAILED;

        return NextResponse.json(
            { message: errorMessage }, 
            { status: 500 }
        )
    } 
}