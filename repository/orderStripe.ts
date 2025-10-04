import prisma from "@/lib/clients/prisma/client"

export const createOrderStripeRepository = () => {
    return {
        // Stripe注文データの作成
        createOrderStripe: async ({ 
            orderStripeData 
        }: { orderStripeData: CreateOrderStripeProps }) => {
            return await prisma.orderStripe.create({
                data: orderStripeData
            })
        }
    }
}

export const deleteOrderStripeRepository = () => {
    return {
        // Stripe注文データの削除
        deleteOrderStripe: async ({ orderId }: { orderId: OrderId }) => {
            return await prisma.orderStripe.delete({
                where: { order_id: orderId }
            })
        }
    }
}