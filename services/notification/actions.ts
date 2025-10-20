import { receiveChatNotificationEmail } from "@/services/email/notification/chat"
import { receiveStockNotificationEmail } from "@/services/email/notification/stock"
import { getNotificationRepository } from "@/repository/notification"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { NOTIFICATION_ERROR } = ERROR_MESSAGES;

export const processNotificationWebhook = async ({
    record
}: { record: NotificationData }) => {
    const repository = getNotificationRepository();
    const notificationWithDetails = await repository.getNotificationWithDetails(record);

    if (record.type === 'product_stock') {
        const result = await receiveStockNotificationEmail(notificationWithDetails);
        return result
    }

    if (record.type === 'chat') {
        const result = await receiveChatNotificationEmail(notificationWithDetails);
        return result
    }

    return {
        success: true,
        error: NOTIFICATION_ERROR.WEBHOOK_PROCESS_FAILED
    }
}