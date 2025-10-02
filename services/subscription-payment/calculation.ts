import { DISCOUNT_PERCENTAGE_MULTIPLIER } from "@/constants/index"

export const getDiscountRate = (
    regularPrice: number, 
    targetPrice: number
): number => {
    if (regularPrice <= targetPrice) return 0;
    
    const discountAmount = regularPrice - targetPrice;
    const discountRate = Math.round(
        (discountAmount / regularPrice) * DISCOUNT_PERCENTAGE_MULTIPLIER
    )
    
    return discountRate;
}