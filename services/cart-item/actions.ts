import { 
    createCartItemRepository, 
    updateCartItemRepository,
    deleteCartItemRepository 
} from "@/repository/cartItem"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CART_ITEM_ERROR } = ERROR_MESSAGES;

interface DeleteCartItemsProps {
    userId: UserId,
    productId: ProductId
}

// カートの商品リストの作成
export const createCartItems = async ({ 
    cartItemsData 
}: { cartItemsData: CartItem }) => {
    try {
        const repository = createCartItemRepository();
        const cartItem = await repository.createCartItems({ cartItemsData });

        return {
            success: true, 
            error: null, 
            data: cartItem
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

// カートの商品リストの削除
export const deleteCartItems = async ({ 
    userId,
    productId 
}: DeleteCartItemsProps) => {
    try {
        const repository = deleteCartItemRepository();
        const cartItem = await repository.deleteCartItem({ userId, productId });

        return {
            success: true, 
            error: null, 
            data: cartItem
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

// カートの商品の数量更新
export const updateCartItemQuantity = async ({
    userId,
    productId,
    quantity
}: UpdateCartItemQuantityProps) => {    
    try {
        const repository = updateCartItemRepository();
        const cartItem = await repository.updateCartItemQuantity({ 
            userId, 
            productId, 
            quantity 
        });

        return {
            success: true, 
            error: null, 
            data: cartItem
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

// カートの全ての商品リストの削除
export const deleteAllCartItems = async ({ 
    userId,
}: { userId: UserId }) => {
    try {
        const repository = deleteCartItemRepository();
        const cartItem = await repository.deleteAllCartItems({ userId });

        return {
            success: true, 
            error: null, 
            data: cartItem
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