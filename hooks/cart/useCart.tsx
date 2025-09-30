import { useCallback, useState } from "react"

import { CART_OPERATION_TYPES, SITE_MAP } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CART_POST, CART_DELETE } = CART_OPERATION_TYPES;
const { CART_API_PATH } = SITE_MAP;
const { CART_ITEM_ERROR } = ERROR_MESSAGES;

interface CartOperationProps {
    productId: ProductId;
    quantity?: number;
}

const useCart = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const cartOperation = useCallback(async (
        method: CartOperationType,
        { productId, quantity }: CartOperationProps
    ) => {
        if (loading || !productId) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const body = method === CART_POST 
                ? JSON.stringify({ productId, quantity })
                : JSON.stringify({ productId });

            const response = await fetch(CART_API_PATH, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body
            });

            const result = await response.json();

            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error(`Hook Error - Cart ${method} error:`, error);
            setError(
                method === CART_POST 
                    ? CART_ITEM_ERROR.ADD_FAILED 
                    : CART_ITEM_ERROR.DELETE_FAILED
            );
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const clearCart = useCallback(async () => {
        if (loading) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${CART_API_PATH}?action=all`, {
                method: CART_DELETE,
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();

            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error(`Hook Error - Cart Clear error:`, error);
            setError(CART_ITEM_ERROR.DELETE_ALL_FAILED);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const addCart = useCallback(async ({ productId, quantity }: CartOperationProps) => {
        await cartOperation(CART_POST, { productId, quantity });
    }, [cartOperation]);

    const removeCart = useCallback(async ({ productId }: CartOperationProps) => {
        await cartOperation(CART_DELETE, { productId });
    }, [cartOperation]);

    return {
        loading,
        error,
        success,
        addCart,
        removeCart,
        clearCart,
    }
}

export default useCart