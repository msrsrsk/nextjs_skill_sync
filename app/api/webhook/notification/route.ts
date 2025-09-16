import { NextRequest, NextResponse } from 'next/server';

import { handleWebhook } from "@/lib/utils/webhook";
import { receiveChatNotificationEmail } from "@/lib/services/email/notification/chat";
import { receiveStockNotificationEmail } from "@/lib/services/email/notification/stock";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

const { PRODUCT_ERROR, CHAT_ERROR, WEBHOOK_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {   
    try {
        const { record }: { record: NotificationData } = await request.json();

        if (record.type === 'product_stock') {
            return handleWebhook<NotificationData>(request, {
                record,
                processFunction: receiveStockNotificationEmail,
                errorText: PRODUCT_ERROR.STOCK_WEBHOOK_PROCESS_FAILED,
                condition: (record: NotificationData) => record.type === 'product_stock'
            });
        }

        return handleWebhook<NotificationData>(request, {
            record,
            processFunction: receiveChatNotificationEmail,
            errorText: CHAT_ERROR.WEBHOOK_PROCESS_FAILED,
            condition: (record: NotificationData) => record.type === 'chat'
        });
    } catch (error) {
        console.error('Webhook Error - Notification POST error:', error);

        const errorMessage = 
            error instanceof Error 
            ? error.message : WEBHOOK_ERROR.PROCESS_FAILED;

        return NextResponse.json(
            { message: errorMessage }, 
            { status: 500 }
        );
    }
}