import { describe, it, expect, vi, beforeEach } from "vitest"

import { formatOrderRemarks } from "@/services/order-item-subscription/format"
import { formatSubscriptionIntervalForOrder } from "@/services/subscription-payment/format"

vi.mock('@/services/subscription-payment/format', () => ({
    formatSubscriptionIntervalForOrder: vi.fn()
}))

/* ==================================== 
    formatOrderRemarks Test
==================================== */
describe('formatOrderRemarks', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // サブスク商品 & 定期購入
    it('should return formatted subscription interval when both subscription_interval and subscription_product are true', () => {
        const mockFormattedInterval = '継続購入：1ヶ月毎'
        vi.mocked(formatSubscriptionIntervalForOrder).mockReturnValue(mockFormattedInterval)

        const item = {
            subscription_interval: '1month',
            subscription_product: true
        }

        const result = formatOrderRemarks(item)

        expect(result).toBe(mockFormattedInterval)
        expect(formatSubscriptionIntervalForOrder).toHaveBeenCalledWith('1month')
    })

    // サブスク商品 & 通常購入
    it('should return one-time purchase message when subscription_product is true but no interval', () => {
        const item = {
            subscription_interval: null,
            subscription_product: true
        }

        const result = formatOrderRemarks(item)

        expect(result).toBe('通常購入：1回のみの購入')
        expect(formatSubscriptionIntervalForOrder).not.toHaveBeenCalled()
    })

    // 通常商品の場合
    it('should return empty string when subscription_product is false', () => {
        const item = {
            subscription_interval: '1month',
            subscription_product: false
        }

        const result = formatOrderRemarks(item)

        expect(result).toBe('')
        expect(formatSubscriptionIntervalForOrder).not.toHaveBeenCalled()
    })

    // 例外発生
    it('should return empty string when subscription_interval exists but subscription_product is false', () => {
        const item = {
            subscription_interval: '1month',
            subscription_product: false
        }

        const result = formatOrderRemarks(item)

        expect(result).toBe('')
        expect(formatSubscriptionIntervalForOrder).not.toHaveBeenCalled()
    })

    // 両方がnullの場合
    it('should return empty string when both values are null', () => {
        const item = {
            subscription_interval: null,
            subscription_product: null
        }

        const result = formatOrderRemarks(item)

        expect(result).toBe('')
        expect(formatSubscriptionIntervalForOrder).not.toHaveBeenCalled()
    })

    // 間隔が空文字列の場合
    it('should return one-time purchase message when subscription_interval is empty string', () => {
        const item = {
            subscription_interval: '',
            subscription_product: true
        }

        const result = formatOrderRemarks(item)

        expect(result).toBe('通常購入：1回のみの購入')
        expect(formatSubscriptionIntervalForOrder).not.toHaveBeenCalled()
    })

    // 間隔がundefinedの場合
    it('should return one-time purchase message when subscription_interval is undefined', () => {
        const item = {
            subscription_interval: undefined as unknown as string,
            subscription_product: true
        }

        const result = formatOrderRemarks(item)

        expect(result).toBe('通常購入：1回のみの購入')
        expect(formatSubscriptionIntervalForOrder).not.toHaveBeenCalled()
    })
})