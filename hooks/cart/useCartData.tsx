import { useCallback, useEffect, useState } from "react"

import { SITE_MAP } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CART_DATA_API_PATH } = SITE_MAP;
const { CART_ITEM_ERROR } = ERROR_MESSAGES;

const useCartData = () => {
    const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getCartData();
    }, []);

    const getCartData = useCallback(async () => {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(CART_DATA_API_PATH, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();

            if (result.success) {
                setCartItems(result.data);
            } else {
                setCartItems([]);
                setError(result.message);
            }
        } catch (error) {
            console.error(`Hook Error - Cart Data error:`, error);
            setCartItems([]);
            setError(CART_ITEM_ERROR.FETCH_FAILED);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    return {
        cartItems,
        setCartItems,
        loading,
        error,
    }
}

export default useCartData