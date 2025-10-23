import { describe, it, expect, vi, beforeEach } from "vitest"

import { getDiscountRate } from "@/services/subscription-payment/calculation"

/* ==================================== 
    getDiscountRate Test
==================================== */
describe('getDiscountRate', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 正規価格が標準価格以上
    it('should return 0 when regular price is less than or equal to target price', () => {
        expect(getDiscountRate(1000, 1200)).toBe(0)
        expect(getDiscountRate(1000, 1000)).toBe(0)
    })

    // 割引率の計算
    it('should return correct discount rate', () => {
        expect(getDiscountRate(1000, 800)).toBe(20) // 20%割引
        expect(getDiscountRate(2000, 1500)).toBe(25) // 25%割引
    })

    // エッジケースのテスト
    it('should handle edge cases', () => {
        // ゼロ除算の防止
        expect(getDiscountRate(0, 100)).toBe(0)
        expect(getDiscountRate(0, 0)).toBe(0)

        // 負の値の処理
        expect(getDiscountRate(-100, -200)).toBe(0)
        expect(getDiscountRate(-100, 100)).toBe(0)
        expect(getDiscountRate(100, -100)).toBe(0)
    })
})