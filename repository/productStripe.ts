import prisma from "@/lib/clients/prisma/client"

export const updateProductStripeRepository = () => {
    return {
        // Stripe商品データの更新
        updateProductStripe: async ({
            productId,
            data
        }: UpdateProductStripeProps) => {
            return await prisma.productStripe.update({
                where: { product_id: productId },
                data: data
            })
        }
    }
}