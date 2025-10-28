import { createOrderShippingRepository } from "@/repository/orderShipping"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ORDER_SHIPPING_ERROR } = ERROR_MESSAGES;

// 注文配送データの作成
export const createOrderShipping = async ({ 
    orderShippingData 
}: { orderShippingData: CreateOrderShippingData }) => {
    try {
        const repository = createOrderShippingRepository();
        const result = await repository.createOrderShipping({ 
            orderShippingData 
        })

        if (!result) {
            return {
                success: false, 
                error: ORDER_SHIPPING_ERROR.CREATE_FAILED,
                data: null
            }
        }
    
        return {
            success: true, 
            error: null,
            data: result
        }
    } catch (error) {
        console.error('Database : Error in createOrderShipping: ', error);

        return {
            success: false, 
            error: ORDER_SHIPPING_ERROR.CREATE_FAILED,
            data: null
        }
    }
}