import { updateProductStripeRepository } from "@/repository/productStripe"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PRODUCT_STRIPE_ERROR } = ERROR_MESSAGES;

// Stripe商品データの更新
export const updateProductStripe = async ({
    productId,
    data
}: UpdateProductStripeProps) => {
    try {
        const repository = updateProductStripeRepository();
        const result = await repository.updateProductStripe({ productId, data });

        if (!result) {
            return {
                success: false, 
                error: PRODUCT_STRIPE_ERROR.UPDATE_FAILED,
            }
        }
    
        return { 
            success: true, 
            error: null
        }
    } catch (error) {
        console.error('Database : Error in updateProductStripe: ', error);

        return {
            success: false, 
            error: PRODUCT_STRIPE_ERROR.UPDATE_FAILED,
        }
    }
}