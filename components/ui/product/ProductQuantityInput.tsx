"use client"

import QuantityInput from "@/components/common/display/QuantityInput"
import { PRODUCT_QUANTITY_SIZES, PRODUCT_QUANTITY_CONFIG } from "@/constants/index"

const { QUANTITY_LARGE } = PRODUCT_QUANTITY_SIZES;
const { MIN_QUANTITY, QUANTITY_STEP } = PRODUCT_QUANTITY_CONFIG;

interface ProductQuantityInputProps {
    size?: ProductQuantitySizeType;
    stock: ProductStock;
    quantity: number;
    setQuantity: (quantity: number) => void;
}

const ProductQuantityInput = ({ 
    size = QUANTITY_LARGE,
    stock,
    quantity,
    setQuantity,
}: ProductQuantityInputProps) => {
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        const finalValue = Math.max(MIN_QUANTITY, Math.min(value, stock));
        setQuantity(finalValue);
    }

    const handleDecrement = () => {
        if (quantity > MIN_QUANTITY) setQuantity(quantity - QUANTITY_STEP);
    }

    const handleIncrement = () => {
        if (quantity < stock) setQuantity(quantity + QUANTITY_STEP);
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

export default ProductQuantityInput