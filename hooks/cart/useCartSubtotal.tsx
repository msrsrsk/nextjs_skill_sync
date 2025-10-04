import { useState, useEffect } from "react"

import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CART_ITEM_ERROR } = ERROR_MESSAGES;

interface useCartSubtotalProps {
    cartItems: CartItemWithProduct[];
    optimisticQuantities: Record<ProductId, number>;
}

const useCartSubtotal = ({ cartItems, optimisticQuantities }: useCartSubtotalProps) => {
    const [subtotal, setSubtotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        try {
            const calculatedSubtotal = cartItems.reduce((acc, item) => {
                const quantity = optimisticQuantities?.[item.product.id] || item.quantity;
                const itemPrice = item.product.product_pricings?.sale_price && item.product.product_pricings.sale_price > 0 
                    ? item.product.product_pricings.sale_price : item.product.price;
                return acc + (itemPrice * quantity);
            }, 0);
            
            setSubtotal(calculatedSubtotal);
        } catch (error) {
            console.error('Hook Error: Calculate Subtotal error:', error);
            setError(CART_ITEM_ERROR.FETCH_SUBTOTAL_FAILED);
            setSubtotal(0);
        } finally {
            setLoading(false);
        }
    }, [cartItems, optimisticQuantities]);

    return {
        subtotal,
        loading,
        error
    }
}

export default useCartSubtotal