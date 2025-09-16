import { NextRequest } from "next/server"

import { handleWebhook } from "@/lib/utils/webhook"
import { receiveReviewNotificationEmail } from "@/lib/services/email/notification/review"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { REVIEW_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {   
    const { record }: { record: Review } = await request.json();

    return handleWebhook<Review>(request, {
        record,
        processFunction: receiveReviewNotificationEmail,
        errorText: REVIEW_ERROR.WEBHOOK_PROCESS_FAILED,
    });
}