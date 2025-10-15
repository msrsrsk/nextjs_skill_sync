import { receiveReviewNotificationEmail } from "@/services/email/notification/review"
import { deleteReviewImage } from "@/services/cloudflare/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { REVIEW_ERROR } = ERROR_MESSAGES;

interface ProcessReviewWebhookProps {
    record?: Review;
    old_record?: Review;
    type?: string;
}

export const processReviewWebhook = async ({
    record,
    old_record,
    type
}: ProcessReviewWebhookProps) => {
    try {
        switch (type) {
            case 'INSERT':
                if (!record) {
                    return {
                        success: false,
                        error: REVIEW_ERROR.WEBHOOK_INSERT_FAILED,
                        status: 400
                    }
                }
                return {
                    success: true,
                    data: {
                        record,
                        processFunction: receiveReviewNotificationEmail,
                        errorText: REVIEW_ERROR.WEBHOOK_INSERT_PROCESS_FAILED,
                    }
                }
            case 'DELETE':
                if (!old_record) {
                    return {
                        success: false,
                        error: REVIEW_ERROR.WEBHOOK_DELETE_FAILED,
                        status: 400
                    }
                }
                return {
                    success: true,
                    data: {
                        record: old_record,
                        processFunction: deleteReviewImage,
                        errorText: REVIEW_ERROR.WEBHOOK_DELETE_PROCESS_FAILED,
                    }
                }
            default:
                return {
                    success: false,
                    error: REVIEW_ERROR.WEBHOOK_PROCESS_FAILED,
                    status: 200
                }
        }
    } catch (error) {
        console.error('API Error - Review Webhook POST error:', error);

        return {
            success: false,
            error: REVIEW_ERROR.WEBHOOK_PROCESS_FAILED,
            status: 500
        }
    }
}