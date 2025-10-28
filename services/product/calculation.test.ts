import { describe, it, expect, vi, beforeEach } from "vitest"

import { getStepByPriceRange } from "@/services/product/calculation"
import { PRICE_SLIDER_CONFIG } from "@/constants/index"

const { STEP_BY_PRICE_RANGE } = PRICE_SLIDER_CONFIG;

/* ==================================== 
    getStepByPriceRange Test
==================================== */
describe('getStepByPriceRange', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 0円以上1000円未満
    it('should return STEP_1 for prices under 1000円', () => {
        expect(getStepByPriceRange(0)).toBe(STEP_BY_PRICE_RANGE.STEP_1)
        expect(getStepByPriceRange(500)).toBe(STEP_BY_PRICE_RANGE.STEP_1)
        expect(getStepByPriceRange(999)).toBe(STEP_BY_PRICE_RANGE.STEP_1)
    })

    // 1000円以上5000円未満
    it('should return STEP_2 for prices between 1000円 and 5000円', () => {
        expect(getStepByPriceRange(1000)).toBe(STEP_BY_PRICE_RANGE.STEP_2)
        expect(getStepByPriceRange(3000)).toBe(STEP_BY_PRICE_RANGE.STEP_2)
        expect(getStepByPriceRange(4999)).toBe(STEP_BY_PRICE_RANGE.STEP_2)
    })

    // 5000円以上20000円未満
    it('should return STEP_3 for prices between 5000円 and 20000円', () => {
        expect(getStepByPriceRange(5000)).toBe(STEP_BY_PRICE_RANGE.STEP_3)
        expect(getStepByPriceRange(10000)).toBe(STEP_BY_PRICE_RANGE.STEP_3)
        expect(getStepByPriceRange(19999)).toBe(STEP_BY_PRICE_RANGE.STEP_3)
    })

    // 20000円以上100000円未満
    it('should return STEP_4 for prices between 20000円 and 100000円', () => {
        expect(getStepByPriceRange(20000)).toBe(STEP_BY_PRICE_RANGE.STEP_4)
        expect(getStepByPriceRange(50000)).toBe(STEP_BY_PRICE_RANGE.STEP_4)
        expect(getStepByPriceRange(99999)).toBe(STEP_BY_PRICE_RANGE.STEP_4)
    })

    // 100000円以上
    it('should return STEP_5 for prices 100000円以上', () => {
        expect(getStepByPriceRange(100000)).toBe(STEP_BY_PRICE_RANGE.STEP_5)
    })

    // 各閾値の境界で正しいステップが返されることを確認
    it('should handle exact threshold values correctly', () => {
        expect(getStepByPriceRange(1000)).toBe(STEP_BY_PRICE_RANGE.STEP_2)
        expect(getStepByPriceRange(5000)).toBe(STEP_BY_PRICE_RANGE.STEP_3)
        expect(getStepByPriceRange(20000)).toBe(STEP_BY_PRICE_RANGE.STEP_4)
        expect(getStepByPriceRange(100000)).toBe(STEP_BY_PRICE_RANGE.STEP_5)
    })

    // 各閾値よりわずかに小さい値でも正しいステップが返されることを確認
    it('should handle values just below thresholds', () => {
        expect(getStepByPriceRange(999)).toBe(STEP_BY_PRICE_RANGE.STEP_1)
        expect(getStepByPriceRange(4999)).toBe(STEP_BY_PRICE_RANGE.STEP_2)
        expect(getStepByPriceRange(19999)).toBe(STEP_BY_PRICE_RANGE.STEP_3)
        expect(getStepByPriceRange(99999)).toBe(STEP_BY_PRICE_RANGE.STEP_4)
    })

    // 0円の場合
    it('should handle zero price', () => {
        expect(getStepByPriceRange(0)).toBe(STEP_BY_PRICE_RANGE.STEP_1)
    })

    // 非常に大きい価格の場合
    it('should handle very large prices', () => {
        expect(getStepByPriceRange(1000000)).toBe(STEP_BY_PRICE_RANGE.STEP_5)
        expect(getStepByPriceRange(10000000)).toBe(STEP_BY_PRICE_RANGE.STEP_5)
    })

    // 小数点以下の価格の場合
    it('should handle decimal prices', () => {
        expect(getStepByPriceRange(999.99)).toBe(STEP_BY_PRICE_RANGE.STEP_1)
        expect(getStepByPriceRange(1000.01)).toBe(STEP_BY_PRICE_RANGE.STEP_2)
        expect(getStepByPriceRange(5000.5)).toBe(STEP_BY_PRICE_RANGE.STEP_3)
    })
})