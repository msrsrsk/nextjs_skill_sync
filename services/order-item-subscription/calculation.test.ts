import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { isWithinThreshold } from "@/services/order-item-subscription/calculation"
import { convertToJST } from "@/lib/utils/format"

vi.mock('@/lib/utils/format', () => ({
    convertToJST: vi.fn()
}))

/* ==================================== 
    isWithinThreshold Test
==================================== */
describe('isWithinThreshold', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        vi.useFakeTimers()
        vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    // 閾値内（現在時刻）
    it('should return true when createdAt is current time', () => {
        const mockDate = new Date('2024-01-15T12:00:00Z')
        vi.mocked(convertToJST).mockReturnValue(mockDate)

        const result = isWithinThreshold(mockDate, 3)
        expect(result).toBe(true)
    })

    // 閾値内（1ヶ月前）
    it('should return true when createdAt is 1 month ago', () => {
        const mockDate = new Date('2023-12-15T12:00:00Z')
        vi.mocked(convertToJST).mockReturnValue(mockDate)

        const result = isWithinThreshold(mockDate, 3)
        expect(result).toBe(true)
    })

    // 閾値内（2ヶ月前）
    it('should return true when createdAt is 2 months ago', () => {
        const mockDate = new Date('2023-11-15T12:00:00Z')
        vi.mocked(convertToJST).mockReturnValue(mockDate)

        const result = isWithinThreshold(mockDate, 3)
        expect(result).toBe(true)
    })

    // 閾値内（3ヶ月 + 1日）
    it('should return true when createdAt is 3 months ago + 1 day', () => {
        const mockDate = new Date('2023-10-16T12:00:00Z')
        vi.mocked(convertToJST).mockReturnValue(mockDate)

        const result = isWithinThreshold(mockDate, 3)
        expect(result).toBe(true)
    })

    // 閾値外（3ヶ月 - 1日）
    it('should return false when createdAt is 3 months ago - 1 day', () => {
        const mockDate = new Date('2023-10-15T12:00:00Z')
        vi.mocked(convertToJST).mockReturnValue(mockDate)

        const result = isWithinThreshold(mockDate, 3)
        expect(result).toBe(false)
    })

    // 閾値外（4ヶ月前）
    it('should return false when createdAt is 4 months ago', () => {
        const mockDate = new Date('2023-09-15T12:00:00Z')
        vi.mocked(convertToJST).mockReturnValue(mockDate)

        const result = isWithinThreshold(mockDate, 3)
        expect(result).toBe(false)
    })

    // 閾値外（6ヶ月前）
    it('should return false when createdAt is 6 months ago', () => {
        const mockDate = new Date('2023-07-15T12:00:00Z')
        vi.mocked(convertToJST).mockReturnValue(mockDate)

        const result = isWithinThreshold(mockDate, 3)
        expect(result).toBe(false)
    })

    // 閾値外（1年前）
    it('should return false when createdAt is 1 year ago', () => {
        const mockDate = new Date('2023-01-15T12:00:00Z')
        vi.mocked(convertToJST).mockReturnValue(mockDate)

        const result = isWithinThreshold(mockDate, 3)
        expect(result).toBe(false)
    })

    // ゼロ閾値
    it('should handle zero threshold', () => {
        const mockDate = new Date('2024-01-15T12:00:00Z')
        vi.mocked(convertToJST).mockReturnValue(mockDate)

        const result = isWithinThreshold(mockDate, 0)
        expect(result).toBe(false)
    })
})