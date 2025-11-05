import { PRICE_SLIDER_CONFIG } from "@/constants/index"

const { STEP_BY_PRICE_RANGE } = PRICE_SLIDER_CONFIG;

export const getStepByPriceRange = (
    price: number
): number => {
    if (price < STEP_BY_PRICE_RANGE.THRESHOLD_1) return STEP_BY_PRICE_RANGE.STEP_1;
    if (price < STEP_BY_PRICE_RANGE.THRESHOLD_2) return STEP_BY_PRICE_RANGE.STEP_2;
    if (price < STEP_BY_PRICE_RANGE.THRESHOLD_3) return STEP_BY_PRICE_RANGE.STEP_3;
    if (price < STEP_BY_PRICE_RANGE.THRESHOLD_4) return STEP_BY_PRICE_RANGE.STEP_4;
    return STEP_BY_PRICE_RANGE.STEP_5;
}

export const getProductEffectivePrice = (product: ProductWithRelations): number => {
    return product.product_pricings?.sale_price && 
           product.product_pricings.sale_price > 0
        ? product.product_pricings.sale_price 
        : product.price;
}