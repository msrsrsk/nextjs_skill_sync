"use client"

import QuantityInput from "@/components/common/display/QuantityInput"
import { useCartStore } from "@/app/stores/useStore"
import { 
    PRODUCT_QUANTITY_SIZES, 
    PRODUCT_QUANTITY_CONFIG
} from "@/constants/index"

const { QUANTITY_MEDIUM } = PRODUCT_QUANTITY_SIZES;
const { MIN_QUANTITY, QUANTITY_STEP } = PRODUCT_QUANTITY_CONFIG;

interface ProductQuantityInputProps {
    size?: ProductQuantitySizeType;
    stock: ProductStock;
    quantity: number;
    onDecrement: () => void;
    onIncrement: () => void;
    onQuantityChange: (value: number) => void;
}

const CartQuantityInput = ({ 
    size = QUANTITY_MEDIUM,
    stock,
    quantity,
    onDecrement,
    onIncrement,
    onQuantityChange
}: ProductQuantityInputProps) => {
    const { cartCount, setCartCount } = useCartStore();

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        const finalValue = Math.max(MIN_QUANTITY, Math.min(value, stock));
        onQuantityChange(finalValue);
    }

    const handleDecrement = () => {
        if (quantity > MIN_QUANTITY) {
            onDecrement();
            setCartCount(cartCount - QUANTITY_STEP);
        }
    }

    const handleIncrement = () => {
        if (quantity < stock) {
            onIncrement();
            setCartCount(cartCount + QUANTITY_STEP);
        }
    }

    return (
        <QuantityInput 
            size={size}
            stock={stock}
            quantity={quantity}
            handleDecrement={handleDecrement}
            handleIncrement={handleIncrement}
            handleQuantityChange={handleQuantityChange}
        />
    )
}

export default CartQuantityInput