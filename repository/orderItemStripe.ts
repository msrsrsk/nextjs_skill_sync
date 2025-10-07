import prisma from "@/lib/clients/prisma/client"

interface CreateOrderItemStripesDataProps {
    orderItemStripeData: {
        order_item_id: OrderItemStripeOrderItemId;
        price_id: OrderItemStripePriceId;
        subscription_id: OrderItemStripeSubscriptionId;
    }
}

export const createOrderItemStripeRepository = () => {
    return {
        // Stripe注文商品リストの作成
        createOrderItemStripe: async ({
            orderItemStripeData
        }: CreateOrderItemStripesDataProps) => {
            return await prisma.orderItemStripe.create({
                data: orderItemStripeData
            })
        }
    }
}