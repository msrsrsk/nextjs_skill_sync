import { createOrderShippingRepository } from "@/repository/orderShipping"

// 注文配送データの作成
export const createOrderShipping = async ({ 
    orderShippingData 
}: { orderShippingData: CreateOrderShippingData }) => {
    const repository = createOrderShippingRepository();
    const result = await repository.createOrderShipping({ 
        orderShippingData 
    })

    return {
        success: !!result, 
        data: result
    }
}