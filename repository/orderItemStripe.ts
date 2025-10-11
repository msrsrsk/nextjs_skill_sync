import prisma from "@/lib/clients/prisma/client"

interface CreateOrderItemStripesDataProps {
    orderItemStripeData: {
        order_item_id: OrderItemStripeOrderItemId;
        price_id: OrderItemStripePriceId;
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

export const deleteOrderItemStripeRepository = () => {
    return {
        // Stripe注文商品リストの削除
        deleteOrderItemStripe: async ({
            orderItemId
        }: { orderItemId: OrderItemStripeOrderItemId }) => {
            return await prisma.orderItemStripe.delete({
                where: {
                    order_item_id: orderItemId
                }
            })
        }
    }
}