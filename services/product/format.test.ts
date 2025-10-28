import { describe, it, expect, vi, beforeEach } from "vitest"

import { 
    formatCategory, 
    formatCollectionSortType,
    formatProductPriceStatus,
    formatOptimalSyncsStatus
} from "@/services/product/format"
import { 
    CATEGORY_TAGS, 
    COLLECTION_SORT_TYPES, 
    PRODUCT_PRICE_STATUS, 
    OPTIMAL_SYNC_TAG_TYPES 
} from "@/constants/index"

const { ALL_TAG, ACTIVE_TAG, EXPLORER_TAG, CREATIVE_TAG, WISDOM_TAG, UNIQUE_TAG, RANDOM_TAG } = CATEGORY_TAGS;
const { CREATED_DESCENDING, BEST_SELLING, TITLE_ASCENDING, TITLE_DESCENDING, PRICE_ASCENDING, PRICE_DESCENDING } = COLLECTION_SORT_TYPES;
const { PRODUCT_SALE, PRODUCT_SOLDOUT } = PRODUCT_PRICE_STATUS;
const { REQUIRED_TAG, OPTION_TAG, PICKUP_TAG } = OPTIMAL_SYNC_TAG_TYPES;

/* ==================================== 
    formatCategory Test
==================================== */
describe('formatCategory', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should format known categories correctly', () => {
        const testCases = [
            { input: ACTIVE_TAG, expected: 'アクティブ' },
            { input: EXPLORER_TAG, expected: '冒険' },
            { input: CREATIVE_TAG, expected: '創作' },
            { input: WISDOM_TAG, expected: '知恵' },
            { input: UNIQUE_TAG, expected: 'ユニーク' },
            { input: RANDOM_TAG, expected: 'ランダム' }
        ];
        
        testCases.forEach(({ input, expected }) => {
            expect(formatCategory(input)).toBe(expected);
        })
    })

    // 取得失敗
    it('should return original string for unknown categories', () => {
        expect(formatCategory('All' as Exclude<ProductCategoryTagType, typeof ALL_TAG>)).toBe('All')
    })
})

/* ==================================== 
    formatCollectionSortType Test
==================================== */
describe('formatCollectionSortType', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should format known sort types correctly', () => {
        const testCases = [
            { input: CREATED_DESCENDING, expected: '新着順' },
            { input: BEST_SELLING, expected: 'ベストセラー' },
            { input: TITLE_ASCENDING, expected: 'タイトル順（A,Z）' },
            { input: TITLE_DESCENDING, expected: 'タイトル順（Z,A）' },
            { input: PRICE_ASCENDING, expected: '価格の安い順' },
            { input: PRICE_DESCENDING, expected: '価格の高い順' }
        ];
        
        testCases.forEach(({ input, expected }) => {
            expect(formatCollectionSortType(input)).toBe(expected);
        })
    })

    // 取得失敗
    it('should return original string for unknown sort types', () => {
        expect(formatCollectionSortType('invalid' as CollectionSortType)).toBe('invalid')
    })
})

/* ==================================== 
    formatProductPriceStatus Test
==================================== */
describe('formatProductPriceStatus', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should format known price statuses correctly', () => {
        const testCases = [
            { input: PRODUCT_SALE, expected: 'セール中' },
            { input: PRODUCT_SOLDOUT, expected: '売り切れ' }
        ];
        
        testCases.forEach(({ input, expected }) => {
            expect(formatProductPriceStatus(input)).toBe(expected);
        })
    })

    // 取得失敗
    it('should return original string for unknown price statuses', () => {
        expect(formatProductPriceStatus('invalid' as ProductPriceStatusType)).toBe('invalid')
    })
})

/* ==================================== 
    formatOptimalSyncsStatus Test
==================================== */
describe('formatOptimalSyncsStatus', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should format known optimal sync statuses correctly', () => {
        const testCases = [
            { input: PICKUP_TAG, expected: 'おすすめ' },
            { input: REQUIRED_TAG, expected: '必須' },
            { input: OPTION_TAG, expected: 'オプション' }
        ];
        
        testCases.forEach(({ input, expected }) => {
            expect(formatOptimalSyncsStatus(input)).toBe(expected);
        })
    })

    // 取得失敗
    it('should return original string for unknown optimal sync statuses', () => {
        expect(formatOptimalSyncsStatus('invalid' as OptimalSyncTagType)).toBe('invalid')
    })
})