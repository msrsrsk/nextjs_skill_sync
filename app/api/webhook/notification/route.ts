import { NextRequest, NextResponse } from 'next/server'

import { verifySupabaseWebhookAuth } from "@/lib/utils/webhook"
import { processNotificationWebhook } from "@/services/notification/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { WEBHOOK_ERROR } = ERROR_MESSAGES;

export async function POST(request: NextRequest) {   
    try {
        const record = await verifySupabaseWebhookAuth({
            request,
            errorMessage: WEBHOOK_ERROR.PROCESS_FAILED
        });
        
        if (record instanceof NextResponse) {
            return record;
        }

        const result = await processNotificationWebhook({ record });

        if (!result.success) {
            return NextResponse.json(
                { message: result.error }, 
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook Error - Notification POST error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : WEBHOOK_ERROR.PROCESS_FAILED;

        return NextResponse.json(
            { message: errorMessage }, 
            { status: 500 }
        )
    }
}