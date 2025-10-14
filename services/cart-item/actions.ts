import { 
    createCartItemRepository, 
    getCartItemRepository,
    updateCartItemRepository,
    deleteCartItemRepository 
} from "@/repository/cartItem"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CART_ITEM_ERROR } = ERROR_MESSAGES;

interface DeleteCartItemsProps {
    userId: UserId,
    productId: ProductId
}

interface AddOrUpdateCartItemProps extends DeleteCartItemsProps {
    quantity: CartItemQuantity
}

// カートの商品リストの作成
export const createCartItems = async ({ 
    cartItemsData 
}: { cartItemsData: CartItem }) => {
    try {
        const repository = createCartItemRepository();
        const cartItem = await repository.createCartItems({ cartItemsData });

        if (!cartItem) {
            return {
                success: false, 
                error: CART_ITEM_ERROR.CREATE_FAILED,
                status: 500
            }
        }

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
            status: 500
        }
    }
}

// カートの商品リストの取得
export const getCartItems = async ({ userId }: UserIdProps) => {
    try {
        const repository = getCartItemRepository();
        const cartItemsResult = await repository.getCartItems({ userId });

        if (!cartItemsResult) {
            return {
                success: false, 
                error: CART_ITEM_ERROR.FETCH_FAILED,
                status: 404
            }
        }

        return { 
            success: true, 
            error: null, 
            data: cartItemsResult || []
        }
    } catch (error) {
        console.error('Database : Error in getCartItems: ', error);

        return {
            success: false, 
            error: CART_ITEM_ERROR.FETCH_FAILED,
            status: 500
        }
    }
}

// 商品IDによるカートデータの取得
export const addOrUpdateCartItem = async ({ 
    userId,
    productId,
    quantity
}: AddOrUpdateCartItemProps) => {
    try {
        const repository = getCartItemRepository();
        const existingCartItem = await repository.getCartItemByProductId({
            userId,
            productId
        });
        
        if (existingCartItem) {
            const newQuantity = existingCartItem.quantity + quantity;

            return await updateCartItemQuantity({
                userId,
                productId,
                quantity: newQuantity
            })
        } else {
            return await createCartItems({
                cartItemsData: {
                    user_id: userId,
                    product_id: productId,
                    quantity,
                    created_at: new Date()
                } as CartItem
            })
        }
    } catch (error) {
        console.error('Database : Error in addOrUpdateCartItem: ', error);

        return {
            success: false, 
            error: CART_ITEM_ERROR.ADD_FAILED,
            status: 500
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

        if (!cartItem) {
            return {
                success: false, 
                error: CART_ITEM_ERROR.DELETE_FAILED,
                status: 404
            }
        }

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
            status: 500
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
        const cartItemResult = await repository.updateCartItemQuantity({ 
            userId, 
            productId, 
            quantity 
        });

        if (!cartItemResult) {
            return {
                success: false, 
                error: CART_ITEM_ERROR.UPDATE_QUANTITY_FAILED,
                status: 404
            }
        }

        return {
            success: true, 
            error: null, 
            data: cartItemResult
        }
    } catch (error) {
        console.error('Database : Error in updateCartItemQuantity: ', error);

        return {
            success: false, 
            error: CART_ITEM_ERROR.UPDATE_QUANTITY_FAILED,
            status: 500
        }
    }
}

// カートの全ての商品リストの削除
export const deleteAllCartItems = async ({ 
    userId,
}: { userId: UserId }) => {
    try {
        const repository = deleteCartItemRepository();
        const cartItemResult = await repository.deleteAllCartItems({ userId });

        if (!cartItemResult) {
            return {
                success: false, 
                error: CART_ITEM_ERROR.DELETE_ALL_FAILED,
                status: 500
            }
        }

        return {
            success: true, 
            error: null, 
            data: cartItemResult
        }
    } catch (error) {
        console.error('Database : Error in deleteAllCartItems: ', error);
        
        return {
            success: false, 
            error: CART_ITEM_ERROR.DELETE_ALL_FAILED,
            status: 500
        }
    }
}