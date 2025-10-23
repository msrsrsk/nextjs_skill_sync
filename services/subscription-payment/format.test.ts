import { describe, it, expect } from "vitest"
import { 
    formatSubscriptionInterval,
    formatSubscriptionIntervalForOrder,
    formatStripeSubscriptionStatus,
    formatCreateSubscriptionNickname,
    getRecurringConfig
} from "@/services/subscription-payment/format"
import { SUBSCRIPTION_INTERVALS, SUBSCRIPTION_INTERVAL_THRESHOLDS } from "@/constants/index"

const { 
    INTERVAL_DAY, 
    INTERVAL_WEEK, 
    INTERVAL_MONTH, 
    INTERVAL_3MONTH, 
    INTERVAL_6MONTH, 
    INTERVAL_YEAR 
} = SUBSCRIPTION_INTERVALS;
const { THRESHOLD_3MONTH, THRESHOLD_6MONTH } = SUBSCRIPTION_INTERVAL_THRESHOLDS;

/* ==================================== 
    formatSubscriptionInterval Test
==================================== */
describe('formatSubscriptionInterval', () => {
    // 取得成功
    it('should format known intervals correctly', () => {
        const testCases = [
            { input: INTERVAL_DAY, expected: '毎日' },
            { input: INTERVAL_WEEK, expected: '毎週' },
            { input: INTERVAL_MONTH, expected: '1ヶ月毎' },
            { input: INTERVAL_3MONTH, expected: '3ヶ月毎' },
            { input: INTERVAL_6MONTH, expected: '6ヶ月毎' },
            { input: INTERVAL_YEAR, expected: '1年毎' }
        ];
        
        testCases.forEach(({ input, expected }) => {
            expect(formatSubscriptionInterval(input)).toBe(expected);
        })
    })

    // 取得失敗
    it('should return original string for unknown intervals', () => {
        expect(formatSubscriptionInterval('invalid')).toBe('invalid')
    })
})

/* ==================================== 
    formatSubscriptionIntervalForOrder Test
==================================== */
describe('formatSubscriptionIntervalForOrder', () => {
    // 取得成功
    it('should format known intervals correctly', () => {
        const testCases = [
            { input: '1day', expected: '継続購入：毎日' },
            { input: '1week', expected: '継続購入：毎週' },
            { input: '1month', expected: '継続購入：1ヶ月毎' },
            { input: '3month', expected: '継続購入：3ヶ月毎' },
            { input: '6month', expected: '継続購入：6ヶ月毎' }
        ];
        
        testCases.forEach(({ input, expected }) => {
            expect(formatSubscriptionIntervalForOrder(input)).toBe(expected);
        })
    })

    // 取得失敗
    it('should return original string for unknown intervals', () => {
        expect(formatSubscriptionIntervalForOrder('invalid')).toBe('invalid')
    })
})

/* ==================================== 
    formatStripeSubscriptionStatus Test
==================================== */
describe('formatStripeSubscriptionStatus', () => {
    // 取得成功
    it('should map stripe statuses correctly', () => {
        const testCases = [
            { input: 'past_due', expected: 'failed' },
            { input: 'active', expected: 'succeeded' },
            { input: 'unpaid', expected: 'failed' },
            { input: 'canceled', expected: 'canceled' }
        ];
        
        testCases.forEach(({ input, expected }) => {
            expect(formatStripeSubscriptionStatus(input)).toBe(expected);
        })
    })

    // 取得失敗
    it('should return original string for unknown statuses', () => {
        expect(formatStripeSubscriptionStatus('unknown')).toBe('pending')
    })
})

/* ==================================== 
    formatCreateSubscriptionNickname Test
==================================== */
describe('formatCreateSubscriptionNickname', () => {
    // 取得成功
    it('should format known intervals correctly', () => {   
        const testCases = [
            { input: 'day', expected: '1日毎価格' },
            { input: 'week', expected: '1週間毎価格' },
            { input: 'month', expected: '1ヶ月毎価格' },
            { input: '3month', expected: '3ヶ月毎価格' },
            { input: '6month', expected: '6ヶ月毎価格' },
            { input: 'year', expected: '1年毎価格' }
        ];
        
        testCases.forEach(({ input, expected }) => {
            expect(formatCreateSubscriptionNickname(input)).toBe(expected);
        })
    })

    // 取得失敗
    it('should return original string for unknown intervals', () => {
        expect(formatCreateSubscriptionNickname('invalid')).toBe('invalid')
    })
})

/* ==================================== 
    getRecurringConfig Test
==================================== */
describe('getRecurringConfig', () => {
    // 取得成功
    it('should format known intervals correctly', () => {
        const testCases = [
            { input: INTERVAL_DAY, expected: { interval: 'day' } },
            { input: INTERVAL_WEEK, expected: { interval: 'week' } },
            { input: INTERVAL_MONTH, expected: { interval: 'month' } },
            { input: INTERVAL_3MONTH, expected: { interval: 'month', interval_count: THRESHOLD_3MONTH } },
            { input: INTERVAL_6MONTH, expected: { interval: 'month', interval_count: THRESHOLD_6MONTH } },
            { input: INTERVAL_YEAR, expected: { interval: 'year' } }
        ];
        
        testCases.forEach(({ input, expected }) => {
            expect(getRecurringConfig(input)).toStrictEqual(expected);
        })
    })

    // 取得失敗
    it('should return original string for unknown intervals', () => {
        expect(getRecurringConfig('invalid')).toBeNull()
    })
})