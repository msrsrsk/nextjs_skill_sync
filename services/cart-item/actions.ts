import { 
    createCartItemRepository, 
    getCartItemRepository,
    updateCartItemRepository,
    deleteCartItemRepository 
} from "@/repository/cartItem"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CART_ITEM_ERROR } = ERROR_MESSAGES;

interface CartItemsProps {
    userId: UserId,
    productId: ProductId
}

// カートの商品リストの作成
export const createCartItems = async ({ 
    cartItemsData 
}: { cartItemsData: CartItem }) => {
    try {
        const repository = createCartItemRepository();
        const result = await repository.createCartItems({ cartItemsData });

        if (!result) {
            return {
                success: false, 
                error: CART_ITEM_ERROR.CREATE_FAILED,
                data: null
            }
        }
    
        return {
            success: true, 
            error: null, 
            data: result
        }
    } catch (error) {
        console.error('Database : Error in createCartItems: ', error);

        return {
            success: false, 
            error: CART_ITEM_ERROR.CREATE_FAILED,
            data: null
        }
    }
}

// カートの商品の数量更新
export const updateCartItemQuantity = async ({
    userId,
    productId,
    quantity
}: UpdateCartItemQuantityProps) => {    
    try {
        const repository = updateCartItemRepository();
        const result = await repository.updateCartItemQuantity({ 
            userId, 
            productId, 
            quantity 
        });

        if (!result) {
            return {
                success: false, 
                error: CART_ITEM_ERROR.UPDATE_QUANTITY_FAILED,
                data: null
            }
        }
    
        return {
            success: true, 
            error: null, 
            data: result
        }
    } catch (error) {
        console.error('Database : Error in updateCartItemQuantity: ', error);

        return {
            success: false, 
            error: CART_ITEM_ERROR.UPDATE_QUANTITY_FAILED,
            data: null
        }
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
    try {
        const repository = deleteCartItemRepository();
        const result = await repository.deleteCartItem({ userId, productId });

        if (!result) {
            return {
                success: false, 
                error: CART_ITEM_ERROR.DELETE_FAILED,
                data: null
            }
        }
    
        return {
            success: true, 
            error: null, 
            data: result
        }
    } catch (error) {
        console.error('Database : Error in deleteCartItems: ', error);

        return {
            success: false, 
            error: CART_ITEM_ERROR.DELETE_FAILED,
            data: null
        }
    }
}

// カートの全ての商品リストの削除
export const deleteAllCartItems = async ({ 
    userId,
}: { userId: UserId }) => {
    try {
        const repository = deleteCartItemRepository();
        const result = await repository.deleteAllCartItems({ userId });

        if (!result) {
            return {
                success: false, 
                error: CART_ITEM_ERROR.DELETE_ALL_FAILED,
                data: null
            }
        }
    
        return {
            success: true, 
            error: null, 
            data: result
        }
    } catch (error) {
        console.error('Database : Error in deleteAllCartItems: ', error);

        return {
            success: false, 
            error: CART_ITEM_ERROR.DELETE_ALL_FAILED,
            data: null
        }
    }
}