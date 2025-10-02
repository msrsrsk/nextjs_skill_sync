import prisma from "@/lib/database/prisma/client"

interface CartItemsDataProps {
    userId: UserId,
    productId: ProductId
}

// カートの商品リストの作成
export const createCartItemsData = async ({
    cartItemsData
}: { cartItemsData: CartItem }) => {
    return await prisma.cartItem.createMany({
        data: cartItemsData as CartItemCreateInput
    });
}

// カートの商品リストの取得（商品IDで取得）
export const getCartItemsByProductIdData = async ({ 
    userId,
    productId 
}: CartItemsDataProps) => {
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
    });
}

// カートの商品リストの取得
export const getCartItemsData = async ({ userId }: { userId: UserId }) => {
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
    });
}

// カートの商品の数量取得
export const getCartCountData = async ({ userId }: { userId: UserId }) => {
    const result = await prisma.cartItem.aggregate({
        where: {
            user_id: userId
        },
        _sum: {
            quantity: true
        }
    });

    return result._sum.quantity || 0;
}

// カートの商品の数量更新
export const updateCartItemQuantityData = async ({
    userId,
    productId,
    quantity
}: UpdateCartItemQuantityProps) => {
    return await prisma.cartItem.update({
        where: { 
            user_product_unique: { 
                user_id: userId, 
                product_id: productId 
            } 
        },
        data: { quantity }
    });
}

// カートの商品リストの削除
export const deleteCartItemsData = async ({ 
    userId,
    productId 
}: CartItemsDataProps) => {
    return await prisma.cartItem.delete({
        where: { 
            user_product_unique: {
                user_id: userId, 
                product_id: productId 
            }
        }
    });
}

// カートの全ての商品リストの削除
export const deleteAllCartItemsData = async ({ 
    userId,
}: { userId: UserId }) => {
    return await prisma.cartItem.deleteMany({
        where: { 
            user_id: userId
        }
    });
}