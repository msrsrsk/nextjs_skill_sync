export const updateProductSaleRepository = () => {
    return {
        // 商品の売り上げ数の更新
        updateProductSoldCountWithTransaction: async ({
            productId,
            quantity,
            tx
        }: { 
            productId: ProductId, 
            quantity: number,
            tx: TransactionClient
        }) => {
            return await tx.productSales.updateMany({
                where: { product_id: productId },
                data: { 
                    sold_count: {
                        increment: quantity
                    }
                }
            })
        }
    }
}