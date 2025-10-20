import { NextRequest, NextResponse } from "next/server"

import { processProductWebhook } from "@/services/product/webhook-actions"
import { verifySupabaseWebhookAuth, getWebhookPayload } from "@/lib/utils/webhook"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PRODUCT_ERROR } = ERROR_MESSAGES;

export async function POST(request: NextRequest) {   
    try {
        // 1. 認証処理
        const authError = await verifySupabaseWebhookAuth({
            request,
            errorMessage: PRODUCT_ERROR.STRIPE_WEBHOOK_PROCESS_FAILED
        });
        
        if (authError) {
            return authError;
        }

        const payload = await getWebhookPayload(request);
        const { record } = JSON.parse(payload);

        const { 
            product_id,
            subscription_price_ids
        } = record;

        const result = await processProductWebhook({
            product_id,
            subscriptionPriceIds: subscription_price_ids
        });

        if (!result.success) {
            if (result.error === PRODUCT_ERROR.FETCH_FAILED) {
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

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook Error - Product POST error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : PRODUCT_ERROR.STRIPE_WEBHOOK_PROCESS_FAILED;

        return NextResponse.json(
            { message: errorMessage }, 
            { status: 500 }
        )
    } 
}