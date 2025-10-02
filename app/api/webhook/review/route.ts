import { NextRequest, NextResponse } from "next/server"

import { handleWebhook } from "@/services/webhook/validation"
import { receiveReviewNotificationEmail } from "@/services/email/notification/review"
import { deleteReviewImage } from "@/services/cloudflare/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { REVIEW_ERROR } = ERROR_MESSAGES;

export async function POST(request: NextRequest) {   
    try {
        const { record, old_record, type }: { 
            record?: Review, 
            old_record?: Review, 
            type?: string 
        } = await request.json();

        switch (type) {
            case 'INSERT':
                if (!record) {
                    return NextResponse.json(
                        { message: REVIEW_ERROR.WEBHOOK_INSERT_FAILED }, 
                        { status: 400 }
                    );
                }
                return handleWebhook<Review>(request, {
                    record,
                    processFunction: receiveReviewNotificationEmail,
                    errorText: REVIEW_ERROR.WEBHOOK_INSERT_PROCESS_FAILED,
                })
            case 'DELETE':
                if (!old_record) {
                    return NextResponse.json(
                        { message: REVIEW_ERROR.WEBHOOK_DELETE_FAILED }, 
                        { status: 400 }
                    );
                }
                return handleWebhook<Review>(request, {
                record: old_record,
                processFunction: deleteReviewImage,
                    errorText: REVIEW_ERROR.WEBHOOK_DELETE_PROCESS_FAILED,
                })
            default:
                return NextResponse.json(
                    { message: REVIEW_ERROR.WEBHOOK_PROCESS_FAILED }, 
                    { status: 200 }
                );
        }
    } catch (error) {
        console.error('API Error - Review Webhook POST error:', error);

        return NextResponse.json(
            { message: REVIEW_ERROR.WEBHOOK_PROCESS_FAILED }, 
            { status: 500 }
        );
    }
}