import { receiveChatNotificationEmail } from "@/services/email/notification/chat"
import { receiveStockNotificationEmail } from "@/services/email/notification/stock"
import { getNotificationRepository } from "@/repository/notification"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PRODUCT_ERROR, CHAT_ERROR, WEBHOOK_ERROR } = ERROR_MESSAGES;

export const processNotificationWebhook = async ({
    record
}: { record: NotificationData }) => {
    const repository = getNotificationRepository();
    const notificationWithDetails = await repository.getNotificationWithDetails(record);

    if (record.type === 'product_stock') {
        return {
            success: true,
            data: {
                record: notificationWithDetails,
                processFunction: receiveStockNotificationEmail,
                errorText: PRODUCT_ERROR.STOCK_WEBHOOK_PROCESS_FAILED,
                condition: (record: NotificationData) => record.type === 'product_stock'
            }
        }
    }

    return {
        success: true,
        data: {
            record: notificationWithDetails,
            processFunction: receiveChatNotificationEmail,
            errorText: CHAT_ERROR.WEBHOOK_PROCESS_FAILED,
            condition: (record: NotificationData) => record.type === 'chat'
        }
    }
}