import { updateProductStripeRepository } from "@/repository/productStripe"

// Stripe商品データの更新
export const updateProductStripe = async ({
    productId,
    data
}: UpdateProductStripeProps) => {
    const repository = updateProductStripeRepository();
    const result = await repository.updateProductStripe({ productId, data });

    return { success: !!result }
}