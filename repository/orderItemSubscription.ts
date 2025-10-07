import prisma from "@/lib/clients/prisma/client"

interface CreateOrderItemSubscriptionsDataProps {
    subscriptionData: {
        order_item_id: OrderItemId;
        subscription_id: OrderItemSubscriptionSubscriptionId;
        status: OrderItemSubscriptionStatus;
        interval: OrderItemSubscriptionInterval;
        remarks: OrderItemSubscriptionRemarks;
    }
}

export const createOrderItemSubscriptionRepository = () => {
    return {
        // サブスクリプションデータの作成
        createOrderItemSubscriptions: async ({
            subscriptionData
        }: CreateOrderItemSubscriptionsDataProps) => {
            return await prisma.orderItemSubscription.create({
                data: subscriptionData
            })
        }
    }
}

export const deleteOrderItemSubscriptionRepository = () => {
    return {
        // サブスクリプションデータの削除
        deleteOrderItemSubscription: async ({
            orderItemId
        }: { orderItemId: OrderItemId }) => {
            return await prisma.orderItemSubscription.delete({
                where: { order_item_id: orderItemId }
            })
        }
    }
}