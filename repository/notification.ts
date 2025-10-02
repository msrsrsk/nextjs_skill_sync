import prisma from "@/lib/database/prisma/client"

export const getNotificationRepository = () => {
    return {
        // 通知データの取得
        getNotificationWithDetails: async (
            notification: NotificationData
        ): Promise<NotificationWithDetails> => {
            let relatedData: ProductNotificationData | ChatNotificationData | null = null;

            switch (notification.notifiable_type) {
                case 'Product':
                    relatedData = await prisma.product.findUnique({
                        where: { id: notification.notifiable_id },
                        select: { 
                            id: true,
                            title: true, 
                        }
                    });
                    break;

                case 'Chat':
                    relatedData = await prisma.chat.findUnique({
                        where: { id: notification.notifiable_id },
                        select: { 
                            id: true,
                            chat_room_id: true,
                            message: true, 
                            sent_at: true, 
                        }
                    });
                    break;
            }

            return {
                ...notification,
                relatedData
            }
        }
    }
}