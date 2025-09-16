import { NextRequest } from "next/server"

import { handleWebhook } from "@/lib/utils/webhook"
import { deleteReviewImage } from "@/lib/services/cloudflare/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { REVIEW_ERROR } = ERROR_MESSAGES;

export async function POST(request: NextRequest) {   
    const { old_record }: { old_record: Review } = await request.json();

    return handleWebhook<Review>(request, {
        record: old_record,
        processFunction: deleteReviewImage,
        errorText: REVIEW_ERROR.WEBHOOK_PROCESS_FAILED,
    });
}