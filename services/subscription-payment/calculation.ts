import { DISCOUNT_PERCENTAGE_MULTIPLIER } from "@/constants/index"

export const getDiscountRate = (
    regularPrice: number, 
    targetPrice: number
): number => {
    if (regularPrice < 0 || targetPrice < 0) return 0; // 負の値の処理
    if (regularPrice === 0) return 0; // ゼロ除算の防止
    if (regularPrice <= targetPrice) return 0; // 正規価格が標準価格以上
    
    const discountAmount = regularPrice - targetPrice;
    const discountRate = Math.round(
        (discountAmount / regularPrice) * DISCOUNT_PERCENTAGE_MULTIPLIER
    )
    
    return discountRate;
}