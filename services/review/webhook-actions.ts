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
    switch (type) {
        case 'INSERT':
            if (!record) {
                return {
                    success: false,
                    error: REVIEW_ERROR.WEBHOOK_INSERT_FAILED
                }
            }
            
            const insertResult = await receiveReviewNotificationEmail(record);
            return insertResult
        case 'DELETE':
            if (!old_record) {
                return {
                    success: false,
                    error: REVIEW_ERROR.WEBHOOK_DELETE_FAILED
                }
            }
            
            const deleteResult = await deleteReviewImage(old_record);
            return deleteResult
        default:
            return {
                success: false,
                error: REVIEW_ERROR.WEBHOOK_PROCESS_FAILED
            }
    }
}