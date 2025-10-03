import { updateProductStripeRepository } from "@/repository/productStripe"

import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PRODUCT_ERROR } = ERROR_MESSAGES;

// Stripe商品データの更新
export const updateProductStripe = async ({
    productId,
    data
}: UpdateProductStripeProps) => {
    try {
        const repository = updateProductStripeRepository();
        await repository.updateProductStripe({ productId, data });

        return {
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in updateProductStripe: ', error);

        return {
            success: false, 
            error: PRODUCT_ERROR.UPDATE_FAILED,
        }
    }
}