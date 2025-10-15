import { NextRequest, NextResponse } from "next/server"

import { handleWebhook } from "@/lib/utils/webhook"
import { processReviewWebhook } from "@/services/review/webhook-actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { REVIEW_ERROR } = ERROR_MESSAGES;

export async function POST(request: NextRequest) {   
    try {
        const { record, old_record, type }: { 
            record?: Review, 
            old_record?: Review, 
            type?: string 
        } = await request.json();

        const result = await processReviewWebhook({
            record,
            old_record,
            type
        });

        if (!result.success) {
            return NextResponse.json(
                { message: result.error }, 
                { status: result.status }
            )
        }

        if (!result.data) {
            return NextResponse.json(
                { message: REVIEW_ERROR.WEBHOOK_PROCESS_FAILED }, 
                { status: 500 }
            )
        }

        return handleWebhook<Review>(request, result.data)
    } catch (error) {
        console.error('API Error - Review Webhook POST error:', error);

        return NextResponse.json(
            { message: REVIEW_ERROR.WEBHOOK_PROCESS_FAILED }, 
            { status: 500 }
        )
    }
}