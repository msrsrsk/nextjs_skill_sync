import prisma from "@/lib/clients/prisma/client"

export const createOrderShippingRepository = () => {
    return {
        // 注文配送データの作成
        createOrderShipping: async ({
            orderShippingData
        }: CreateOrderShippingProps) => {
            return await prisma.orderShipping.create({
                data: orderShippingData
            })
        }
    }
}