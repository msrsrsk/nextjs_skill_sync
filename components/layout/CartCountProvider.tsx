"use client"

import { useEffect } from "react"
import { useCartStore } from "@/app/stores/useStore"

const CartCountProvider = ({ 
    cartCount 
}: { cartCount: number }) => {
    const { setCartCount } = useCartStore();

    useEffect(() => {
        setCartCount(cartCount);
    }, [cartCount]);

    return null
}

export default CartCountProvider