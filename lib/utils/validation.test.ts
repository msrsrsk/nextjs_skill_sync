import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { 
    isValidCategory,
    startTokenValidation
} from "@/lib/utils/validation"
import { CATEGORY_TAGS } from "@/constants/index"

const { ACTIVE_TAG, EXPLORER_TAG, CREATIVE_TAG, WISDOM_TAG, UNIQUE_TAG } = CATEGORY_TAGS;

/* ==================================== 
    isValidCategory Test
==================================== */
describe('isValidCategory', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockCategoryConstants = {
        ALL_TAG: 'All',
        ACTIVE_TAG: 'Active',
        EXPLORER_TAG: 'Explorer',
        CREATIVE_TAG: 'Creative',
        WISDOM_TAG: 'Wisdom',
        UNIQUE_TAG: 'Unique',
        RANDOM_TAG: 'Random',
    }

    // 有効なカテゴリ（完全一致 - 大文字）
    it('should return true for valid category (exact match uppercase)', () => {
        expect(isValidCategory('Active', mockCategoryConstants)).toBe(true)
        expect(isValidCategory('Explorer', mockCategoryConstants)).toBe(true)
        expect(isValidCategory('Creative', mockCategoryConstants)).toBe(true)
    })

    // 有効なカテゴリ（小文字）
    it('should return true for valid category (lowercase)', () => {
        expect(isValidCategory('active', mockCategoryConstants)).toBe(true)
        expect(isValidCategory('explorer', mockCategoryConstants)).toBe(true)
        expect(isValidCategory('creative', mockCategoryConstants)).toBe(true)
    })

    // 有効なカテゴリ（大文字小文字混在）
    it('should return true for valid category (mixed case)', () => {
        expect(isValidCategory('AcTiVe', mockCategoryConstants)).toBe(true)
        expect(isValidCategory('ExPlOrEr', mockCategoryConstants)).toBe(true)
        expect(isValidCategory('CrEaTiVe', mockCategoryConstants)).toBe(true)
    })

    // 無効なカテゴリ
    it('should return false for invalid category', () => {
        expect(isValidCategory('Invalid', mockCategoryConstants)).toBe(false)
        expect(isValidCategory('Unknown', mockCategoryConstants)).toBe(false)
        expect(isValidCategory('Test', mockCategoryConstants)).toBe(false)
    })

    // 空文字列
    it('should return false for empty string', () => {
        expect(isValidCategory('', mockCategoryConstants)).toBe(false)
    })

    // categoryConstants が空のオブジェクトの場合
    it('should return false when categoryConstants is empty', () => {
        const emptyConstants = {}
        expect(isValidCategory('Active', emptyConstants)).toBe(false)
        expect(isValidCategory('', emptyConstants)).toBe(false)
    })

    // 部分的に一致の場合（無効）
    it('should return false for partial matches', () => {
        expect(isValidCategory('ActiveTest', mockCategoryConstants)).toBe(false)
        expect(isValidCategory('TestActive', mockCategoryConstants)).toBe(false)
        expect(isValidCategory('Act', mockCategoryConstants)).toBe(false)
    })

    // スペースが含まれる場合（無効）
    it('should return false for category with spaces', () => {
        expect(isValidCategory('Active ', mockCategoryConstants)).toBe(false)
        expect(isValidCategory(' Active', mockCategoryConstants)).toBe(false)
        expect(isValidCategory('Active Test', mockCategoryConstants)).toBe(false)
    })

    // 特殊文字が含まれる場合（無効）
    it('should return false for category with special characters', () => {
        expect(isValidCategory('Active!', mockCategoryConstants)).toBe(false)
        expect(isValidCategory('Active@', mockCategoryConstants)).toBe(false)
        expect(isValidCategory('Active#', mockCategoryConstants)).toBe(false)
    })
})

/* ==================================== 
    startTokenValidation Test
==================================== */
describe('startTokenValidation', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    // 有効期限切れの場合
    it('should call onExpiry immediately and return null when expiry time has passed', () => {
        const mockOnExpiry = vi.fn()
        const now = new Date()
        const pastExpiryTime = new Date(now.getTime() - 1000) // 1秒前

        const result = startTokenValidation(pastExpiryTime, mockOnExpiry)

        expect(mockOnExpiry).toHaveBeenCalledTimes(1)
        expect(result).toBeNull()
    })

    // 有効期限が現在時刻の場合
    it('should call onExpiry immediately when expiry time is exactly now', () => {
        const mockOnExpiry = vi.fn()
        const now = new Date()
        vi.setSystemTime(now)

        const result = startTokenValidation(now, mockOnExpiry)

        expect(mockOnExpiry).toHaveBeenCalledTimes(1)
        expect(result).toBeNull()
    })

    // 有効期限が未来の場合
    it('should set timeout and return timer ID when expiry time is in the future', () => {
        const mockOnExpiry = vi.fn()
        const now = new Date()
        vi.setSystemTime(now)
        const futureExpiryTime = new Date(now.getTime() + 5000) // 5秒後

        const result = startTokenValidation(futureExpiryTime, mockOnExpiry)

        expect(mockOnExpiry).not.toHaveBeenCalled()
        expect(result).not.toBeNull()
        expect(result).toBeTruthy()
    })

    // onExpiry が呼ばれるタイミングのテスト
    it('should call onExpiry when timeout expires', () => {
        const mockOnExpiry = vi.fn()
        const now = new Date()
        vi.setSystemTime(now)
        const futureExpiryTime = new Date(now.getTime() + 5000) // 5秒後

        startTokenValidation(futureExpiryTime, mockOnExpiry)

        expect(mockOnExpiry).not.toHaveBeenCalled()

        vi.advanceTimersByTime(5000) // 5秒経過

        expect(mockOnExpiry).toHaveBeenCalledTimes(1)
    })

    // onExpiry が呼ばれないテスト
    it('should not call onExpiry when timeout does not expire', () => {
        const mockOnExpiry = vi.fn()
        const now = new Date('2024-01-01T12:00:00Z')
        vi.setSystemTime(now)
        const futureExpiryTime = new Date(now.getTime() + 3000) // 3秒後

        startTokenValidation(futureExpiryTime, mockOnExpiry)

        vi.advanceTimersByTime(2000) // 2秒経過
        expect(mockOnExpiry).not.toHaveBeenCalled()

        vi.advanceTimersByTime(1000) // 1秒経過
        expect(mockOnExpiry).toHaveBeenCalledTimes(1)
    })

    // 長時間の場合
    it('should handle long expiry times', () => {
        const mockOnExpiry = vi.fn()
        const now = new Date()
        vi.setSystemTime(now)
        const futureExpiryTime = new Date(now.getTime() + 3600000) // 1時間後

        const result = startTokenValidation(futureExpiryTime, mockOnExpiry)

        expect(mockOnExpiry).not.toHaveBeenCalled()
        expect(result).not.toBeNull()

        // 1時間経過
        vi.advanceTimersByTime(3600000)

        expect(mockOnExpiry).toHaveBeenCalledTimes(1)
    })

    // 短い時間の場合
    it('should handle very short expiry times', () => {
        const mockOnExpiry = vi.fn()
        const now = new Date()
        vi.setSystemTime(now)
        const futureExpiryTime = new Date(now.getTime() + 1) // 1ミリ秒後

        const result = startTokenValidation(futureExpiryTime, mockOnExpiry)

        expect(mockOnExpiry).not.toHaveBeenCalled()
        expect(result).not.toBeNull()

        vi.advanceTimersByTime(1) // 1ミリ秒経過

        expect(mockOnExpiry).toHaveBeenCalledTimes(1)
    })

    // 複数回の呼び出しの場合
    it('should handle multiple calls independently', () => {
        const mockOnExpiry1 = vi.fn()
        const mockOnExpiry2 = vi.fn()
        const now = new Date()
        vi.setSystemTime(now)

        const expiryTime1 = new Date(now.getTime() + 1000) // 1秒後
        const expiryTime2 = new Date(now.getTime() + 2000) // 2秒後

        const timer1 = startTokenValidation(expiryTime1, mockOnExpiry1)
        const timer2 = startTokenValidation(expiryTime2, mockOnExpiry2)

        expect(timer1).not.toBeNull()
        expect(timer2).not.toBeNull()
        expect(timer1).not.toBe(timer2) // 異なるタイマーID

        // 1秒経過
        vi.advanceTimersByTime(1000)
        expect(mockOnExpiry1).toHaveBeenCalledTimes(1)
        expect(mockOnExpiry2).not.toHaveBeenCalled()

        // さらに1秒経過
        vi.advanceTimersByTime(1000)
        expect(mockOnExpiry1).toHaveBeenCalledTimes(1)
        expect(mockOnExpiry2).toHaveBeenCalledTimes(1)
    })

    // 有効期限が負の値の場合（過去の日付）
    it('should handle negative time difference', () => {
        const mockOnExpiry = vi.fn()
        const now = new Date()
        vi.setSystemTime(now)
        const pastExpiryTime = new Date(now.getTime() - 10000) // 10秒前

        const result = startTokenValidation(pastExpiryTime, mockOnExpiry)

        expect(mockOnExpiry).toHaveBeenCalledTimes(1)
        expect(result).toBeNull()
    })

    // 有効期限がちょうど0の場合
    it('should handle expiry time exactly at zero', () => {
        const mockOnExpiry = vi.fn()
        const now = new Date()
        vi.setSystemTime(now)
        
        // 同じ時刻を設定（差が0）
        const result = startTokenValidation(now, mockOnExpiry)

        expect(mockOnExpiry).toHaveBeenCalledTimes(1)
        expect(result).toBeNull()
    })
})