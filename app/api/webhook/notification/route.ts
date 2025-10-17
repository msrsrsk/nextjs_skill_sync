import { NextRequest, NextResponse } from 'next/server'

import { handleWebhook } from "@/lib/utils/webhook"
import { processNotificationWebhook } from "@/services/notification/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { WEBHOOK_ERROR } = ERROR_MESSAGES;

export async function POST(request: NextRequest) {   
    try {
        const { record }: { record: NotificationData } = await request.json();

        const result = await processNotificationWebhook({ record });

        if (!result.success || !result.data) {
            return NextResponse.json(
                { message: WEBHOOK_ERROR.PROCESS_FAILED }, 
                { status: 500 }
            )
        }

        return handleWebhook<NotificationData>(request, result.data)
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