import prisma from "@/lib/database/prisma/client"

interface CartItemProps extends UserIdProps {
    productId: ProductId
}

interface UpdateCartItemProps extends CartItemProps {
    quantity: number
}

export const createCartItemRepository = () => {
    return {
        // カートの商品リストの作成
        createCartItems: async ({ 
            cartItemsData
        }: { cartItemsData: CartItem }) => {
            return await prisma.cartItem.createMany({
                data: cartItemsData as CartItemCreateInput
            });
        }
    }
}

export const getCartItemRepository = () => {
    return {
        // カートの商品リストの取得（商品IDで取得）
        getCartItemByProductId: async ({ 
            userId, 
            productId 
        }: CartItemProps) => {
            return await prisma.cartItem.findUnique({
                where: {
                    user_product_unique: {
                        user_id: userId, 
                        product_id: productId 
                    }
                },
                select: {
                    quantity: true,
                }
            })
        },
        // カートの商品リストの取得
        getCartItems: async ({ userId }: UserIdProps) => {
            return await prisma.cartItem.findMany({
                where: {
                    user_id: userId
                },
                include: {
                    product: {
                        select: {
                            id: true,
                            title: true,
                            image_urls: true,
                            price: true,
                            sale_price: true,
                            category: true,
                            slug: true,
                            stock: true,
                            stripe_sale_price_id: true,
                            stripe_regular_price_id: true,
                        }
                    }
                }
            })
        },
        // カートの商品の数量取得
        getCartCount: async ({ userId }: UserIdProps) => {
            const result = await prisma.cartItem.aggregate({
                where: {
                    user_id: userId
                },
                _sum: {
                    quantity: true
                }
            })
        
            return result._sum.quantity || 0;
        }
    }
}

export const updateCartItemRepository = () => {
    return {
        // カートの商品の数量更新
        updateCartItemQuantity: async ({ 
            userId, 
            productId, 
            quantity 
        }: UpdateCartItemProps) => {
            return await prisma.cartItem.update({
                where: { 
                    user_product_unique: { 
                        user_id: userId, 
                        product_id: productId 
                    } 
                },
                data: { quantity }
            })
        }
    }
}

export const deleteCartItemRepository = () => {
    return {
        // カートの商品リストの削除
        deleteCartItem: async ({ 
            userId, 
            productId 
        }: CartItemProps) => {
            return await prisma.cartItem.delete({
                where: { 
                    user_product_unique: {
                        user_id: userId, 
                        product_id: productId 
                    }
                }
            })
        },
        // カートの全ての商品リストの削除
        deleteAllCartItems: async ({ userId }: UserIdProps) => {
            return await prisma.cartItem.deleteMany({
                where: { 
                    user_id: userId
                }
            })
        }
    }
}