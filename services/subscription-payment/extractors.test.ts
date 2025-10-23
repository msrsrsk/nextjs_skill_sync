import { describe, it, expect } from "vitest"

import { 
    extractCreateSubscriptionPrices,
    extractSubscriptionPrices,
    extractUpdatedSubscriptionPriceIds
} from "@/services/subscription-payment/extractors"

/* ==================================== 
    extractCreateSubscriptionPrices Test
==================================== */
describe('extractCreateSubscriptionPrices', () => {
    // 取得成功
    it('should return valid prices', () => {
        const priceIds = '1day_1000\n1week_2000\n1month_3000\n3month_4000\n6month_5000\n1year_6000';

        const expected = [
            { interval: '1day', price: 1000 },
            { interval: '1week', price: 2000 },
            { interval: '1month', price: 3000 },
            { interval: '3month', price: 4000 },
            { interval: '6month', price: 5000 },
            { interval: '1year', price: 6000 },
        ];

        expect(extractCreateSubscriptionPrices(priceIds)).toEqual(expected);
    })

    // 空文字
    it('should return empty array when priceIds is empty string', () => {
        const priceIds = '';
        expect(extractCreateSubscriptionPrices(priceIds)).toEqual([]);
    })

    // 無効な形式
    it('should return empty array when priceIds is invalid format', () => {
        const invalidFormats = [
            'invalid_format\nanother_invalid', // 金額無し
            '1000\n2000\n3000', // 間隔無し
            '1day1000\n1week2000' // ハイフン無し
        ];
        
        invalidFormats.forEach(priceIds => {
            expect(extractCreateSubscriptionPrices(priceIds)).toEqual([]);
        });
    })
})

/* ==================================== 
    extractSubscriptionPrices Test
==================================== */
describe('extractSubscriptionPrices', () => {
    // 取得成功
    it('should return valid prices', () => {
        const priceIds = 'day_price_ABC123_1000\nweek_price_DEF456_2000\nmonth_price_GHI789_3000\n3month_price_JKL012_4000\n6month_price_MNO345_5000\n1year_price_PQR678_6000';

        const expected = [
            { interval: 'day', priceId: 'price_ABC123', price: 1000 },
            { interval: 'week', priceId: 'price_DEF456', price: 2000 },
            { interval: 'month', priceId: 'price_GHI789', price: 3000 },
            { interval: '3month', priceId: 'price_JKL012', price: 4000 },
            { interval: '6month', priceId: 'price_MNO345', price: 5000 },
            { interval: '1year', priceId: 'price_PQR678', price: 6000 },
        ];

        expect(extractSubscriptionPrices(priceIds)).toEqual(expected);
    })

    // 空文字
    it('should return empty array when priceIds is empty string', () => {
        const priceIds = '';
        expect(extractSubscriptionPrices(priceIds)).toEqual([]);
    })

    // 無効な形式(金額無し)
    it('should return empty array when priceIds is invalid format (no price)', () => {
        const priceIds = 'day_price_ABC123\nweek_price_DEF456';
    
        expect(extractSubscriptionPrices(priceIds)).toEqual([
            { interval: 'day', priceId: 'price_ABC123', price: undefined },
            { interval: 'week', priceId: 'price_DEF456', price: undefined }
        ]);
    })

    // 無効な形式
    it('should return empty array when priceIds is invalid format', () => {
        const invalidFormats = [
            'price_ABC123_1000\nprice_DEF456_2000', // 間隔無し
            'day_1000\nweek_2000', // 料金ID無し
            'daypriceABC1231000\nweekpriceDEF4562000' // ハイフン無し
        ];
        
        invalidFormats.forEach(priceIds => {
            expect(extractSubscriptionPrices(priceIds)).toEqual([]);
        });
    })
})

/* ==================================== 
    extractUpdatedSubscriptionPriceIds Test
==================================== */
describe('extractUpdatedSubscriptionPriceIds', () => {
    // 取得成功
    it('should return valid prices', () => {
        const successfulPrices = [
            { interval: 'day', priceId: 'price_ABC123', price: 1000 },
            { interval: 'week', priceId: 'price_DEF456', price: 2000 },
            { interval: 'month', priceId: 'price_GHI789', price: 3000 },
            { interval: '3month', priceId: 'price_JKL012', price: 4000 },
            { interval: '6month', priceId: 'price_MNO345', price: 5000 },
            { interval: '1year', priceId: 'price_PQR678', price: 6000 },
        ];
        const subscriptionPriceIds = 'day_1000\nweek_2000\nmonth_3000\n3month_4000\n6month_5000\n1year_6000';

        const expected = 'day_price_ABC123_1000\nweek_price_DEF456_2000\nmonth_price_GHI789_3000\n3month_price_JKL012_4000\n6month_price_MNO345_5000\n1year_price_PQR678_6000';
        expect(extractUpdatedSubscriptionPriceIds(subscriptionPriceIds, successfulPrices)).toEqual(expected);
    })

    // 取得失敗
    it('should return empty string when successfulPrices is empty array', () => {
        const successfulPrices: SubscriptionOption[] = [];
        const subscriptionPriceIds = 'day_1000\nweek_2000\nmonth_3000\n3month_4000\n6month_5000\n1year_6000';
        expect(extractUpdatedSubscriptionPriceIds(subscriptionPriceIds, successfulPrices)).toEqual(subscriptionPriceIds);
    })
})