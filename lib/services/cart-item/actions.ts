import { 
    createCartItemsData, 
    updateCartItemQuantityData,
    deleteCartItemsData, 
    deleteAllCartItemsData 
} from "@/lib/database/prisma/actions/cartItems"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CART_ITEM_ERROR } = ERROR_MESSAGES;

interface DeleteCartItemsDataProps {
    userId: UserId,
    productId: ProductId
}

// カートの商品リストの作成
export const createCartItems = async ({ 
    cartItemsData 
}: { cartItemsData: CartItem }) => {
    try {
        const cartItem = await createCartItemsData({ cartItemsData });

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
}: DeleteCartItemsDataProps) => {
    try {
        const cartItem = await deleteCartItemsData({ userId, productId });

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
}: UpdateCartItemQuantityDataProps) => {    
    try {
        const cartItem = await updateCartItemQuantityData({ 
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
        const cartItem = await deleteAllCartItemsData({ userId });

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