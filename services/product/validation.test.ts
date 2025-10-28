import { describe, it, expect, vi, beforeEach } from "vitest"

import { isValidProductCategory } from "@/services/product/validation"
import { CATEGORY_TAGS } from "@/constants/index"

const { ACTIVE_TAG, EXPLORER_TAG, CREATIVE_TAG, WISDOM_TAG, UNIQUE_TAG } = CATEGORY_TAGS;

/* ==================================== 
    isValidProductCategory Test
==================================== */
describe('isValidProductCategory', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should return true for valid categories', () => {
        expect(isValidProductCategory(ACTIVE_TAG)).toBe(true)
        expect(isValidProductCategory(EXPLORER_TAG)).toBe(true)
        expect(isValidProductCategory(CREATIVE_TAG)).toBe(true)
        expect(isValidProductCategory(WISDOM_TAG)).toBe(true)
        expect(isValidProductCategory(UNIQUE_TAG)).toBe(true)
    })

    // 取得失敗
    it('should return false for invalid categories', () => {
        expect(isValidProductCategory('invalid')).toBe(false)
        expect(isValidProductCategory('All')).toBe(false)
        expect(isValidProductCategory('Random')).toBe(false)
    })
})