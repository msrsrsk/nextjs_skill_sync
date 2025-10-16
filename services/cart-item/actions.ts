import { 
    createCartItemRepository, 
    getCartItemRepository,
    updateCartItemRepository,
    deleteCartItemRepository 
} from "@/repository/cartItem"

interface CartItemsProps {
    userId: UserId,
    productId: ProductId
}

// カートの商品リストの作成
export const createCartItems = async ({ 
    cartItemsData 
}: { cartItemsData: CartItem }) => {
    const repository = createCartItemRepository();
    const result = await repository.createCartItems({ cartItemsData });

    return {
        success: !!result, 
        data: result
    }
}

// カートの商品の数量更新
export const updateCartItemQuantity = async ({
    userId,
    productId,
    quantity
}: UpdateCartItemQuantityProps) => {    
    const repository = updateCartItemRepository();
    const result = await repository.updateCartItemQuantity({ 
        userId, 
        productId, 
        quantity 
    });

    return {
        success: !!result, 
        data: result
    }
}

// カートの商品リストの取得
export const getCartItems = async ({ userId }: UserIdProps) => {
    const repository = getCartItemRepository();
    const result = await repository.getCartItems({ userId });

    return { data: result }
}

// 商品IDによるカートデータの取得
export const getCartItemByProduct = async ({ 
    userId,
    productId
}: CartItemsProps) => {
    const repository = getCartItemRepository();
    const existingCartItem = await repository.getCartItemByProductId({
        userId,
        productId
    });
    
    return { data: existingCartItem }
}

// カートの商品リストの削除
export const deleteCartItems = async ({ 
    userId,
    productId 
}: CartItemsProps) => {
    const repository = deleteCartItemRepository();
    const result = await repository.deleteCartItem({ userId, productId });

    return {
        success: !!result, 
        data: result
    }
}

// カートの全ての商品リストの削除
export const deleteAllCartItems = async ({ 
    userId,
}: { userId: UserId }) => {
    const repository = deleteCartItemRepository();
    const result = await repository.deleteAllCartItems({ userId });

    return {
        success: !!result, 
        data: result
    }
}