import prisma from "@/lib/clients/prisma/client"

interface CreateOrderItemStripesDataProps {
    orderItemStripesData: Array<{
        order_item_id: OrderItemStripeOrderItemId;
        price_id: OrderItemStripePriceId;
        subscription_id: OrderItemStripeSubscriptionId;
    }>;
}

export const createOrderItemStripeRepository = () => {
    return {
        // Stripe注文商品リストの作成
        createOrderItemStripes: async ({
            orderItemStripesData
        }: CreateOrderItemStripesDataProps) => {
            return await prisma.orderItemStripe.createMany({
                data: orderItemStripesData
            })
        }
    }
}