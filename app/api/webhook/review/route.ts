import { NextRequest, NextResponse } from "next/server"

import { verifySupabaseWebhookAuth } from "@/lib/utils/webhook"
import { processReviewWebhook } from "@/services/review/webhook-actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { REVIEW_ERROR } = ERROR_MESSAGES;

export async function POST(request: NextRequest) {   
    try {
        const webhookData = await verifySupabaseWebhookAuth({
            request,
            errorMessage: REVIEW_ERROR.WEBHOOK_PROCESS_FAILED
        });

        if (webhookData instanceof NextResponse) {
            return webhookData;
        }

        const result = await processReviewWebhook({
            record: webhookData.record,
            old_record: webhookData.old_record,
            type: webhookData.type
        });

        if (!result.success) {
            if (result.error === REVIEW_ERROR.WEBHOOK_INSERT_FAILED || 
                result.error === REVIEW_ERROR.WEBHOOK_DELETE_FAILED) {
                return NextResponse.json(
                    { message: result.error }, 
                    { status: 400 }
                )
            }

            if (result.error === REVIEW_ERROR.WEBHOOK_PROCESS_FAILED) {
                return NextResponse.json(
                    { message: result.error }, 
                    { status: 200 }
                )
            }
            
            return NextResponse.json(
                { message: result.error }, 
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error - Review Webhook POST error:', error);

        return NextResponse.json(
            { message: REVIEW_ERROR.WEBHOOK_PROCESS_FAILED }, 
            { status: 400 }
        )
    }
}