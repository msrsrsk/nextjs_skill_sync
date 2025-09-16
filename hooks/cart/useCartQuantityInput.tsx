import { useState, useCallback } from "react"

import { CART_QUANTITY_CONFIG, SITE_MAP } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CART_QUANTITY_API_PATH } = SITE_MAP;
const { MIN_QUANTITY, MAX_QUANTITY, QUANTITY_CHANGE } = CART_QUANTITY_CONFIG;
const { CART_ITEM_ERROR } = ERROR_MESSAGES;

interface useCartQuantityProps {
    productId: ProductId;
    quantity: number;
    onQuantityUpdate: (quantity: number) => void;
}

const useCartQuantity = ({ 
    productId, 
    quantity,
    onQuantityUpdate,
}: useCartQuantityProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateQuantity = useCallback(async (newQuantity: number) => {
        if (newQuantity < MIN_QUANTITY || newQuantity > MAX_QUANTITY) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(CART_QUANTITY_API_PATH, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    quantity: newQuantity
                })
            });

            const result = await response.json();

            if (result.success) {
                if (onQuantityUpdate) onQuantityUpdate(newQuantity);
            } else {
                setError(result.message);
                if (onQuantityUpdate) onQuantityUpdate(quantity);
            }
        } catch (error) {
            console.error('Hook Error - Update Quantity error:', error);
            setError(CART_ITEM_ERROR.UPDATE_QUANTITY_FAILED);

            if (onQuantityUpdate) onQuantityUpdate(quantity);
        } finally {
            setLoading(false);
        }
    }, [productId])

    const decreaseQuantity = useCallback(() => {
        const newQuantity = quantity - QUANTITY_CHANGE;
        updateQuantity(newQuantity);
    }, [quantity, updateQuantity])

    const increaseQuantity = useCallback(() => {
        const newQuantity = quantity + QUANTITY_CHANGE;
        updateQuantity(newQuantity);
    }, [quantity, updateQuantity])

    const handleQuantityChange = useCallback((value: number) => {
        updateQuantity(value);
    }, [updateQuantity])
    
    return {
        loading,
        error,
        increaseQuantity,
        decreaseQuantity,
        handleQuantityChange
    }
}

export default useCartQuantity