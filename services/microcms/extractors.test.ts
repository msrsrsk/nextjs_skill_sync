import { describe, it, expect, vi, beforeEach } from "vitest"

import { extractSyncLogData } from "@/services/microcms/extractors"
import { CATEGORY_TAGS, SITE_MAP, NOIMAGE_PRODUCT_IMAGE_URL } from "@/constants/index"

const { 
    ACTIVE_TAG, 
    EXPLORER_TAG, 
    CREATIVE_TAG, 
    WISDOM_TAG, 
    UNIQUE_TAG, 
    RANDOM_TAG 
} = CATEGORY_TAGS;
const { CATEGORY_PATH } = SITE_MAP;

/* ==================================== 
    extractSyncLogList Test
==================================== */
describe('extractSyncLogList', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 抽出成功
    it('should extract data from valid product link', () => {
        const productLink = '/category/active/test-product-name'
        
        const result = extractSyncLogData(productLink)
        
        expect(result).toEqual({
            imageUrl: 'active/test-product-name',
            categoryName: ACTIVE_TAG,
            productName: 'Test Product Name'
        })
    })

    // 抽出成功（異なるカテゴリ）
    it('should extract category name correctly', () => {
        const testCases = [
            { link: '/category/explorer/sample-product', expectedCategory: EXPLORER_TAG },
            { link: '/category/creative/sample-product', expectedCategory: CREATIVE_TAG },
            { link: '/category/wisdom/sample-product', expectedCategory: WISDOM_TAG },
            { link: '/category/unique/sample-product', expectedCategory: UNIQUE_TAG },
            { link: '/category/random/sample-product', expectedCategory: RANDOM_TAG }
        ]

        testCases.forEach(({ link, expectedCategory }) => {
            const result = extractSyncLogData(link)
            expect(result.categoryName).toBe(expectedCategory)
        })
    })

    // 抽出成功（異なる商品名）
    it('should extract data for different product names', () => {
        const testCases = [
            { link: '/category/active/simple-name', expected: 'Simple Name' },
            { link: '/category/active/multi-word-product-name', expected: 'Multi Word Product Name' },
            { link: '/category/active/single', expected: 'Single' },
            { link: '/category/active/very-long-product-name-with-many-words', expected: 'Very Long Product Name With Many Words' }
        ]

        testCases.forEach(({ link, expected }) => {
            const result = extractSyncLogData(link)
            expect(result.productName).toBe(expected)
        })
    })

    // 無効なURLのテスト
    it('should handle invalid or malformed URLs', () => {
        const testCases = [
            { link: null, expected: { imageUrl: NOIMAGE_PRODUCT_IMAGE_URL, categoryName: ACTIVE_TAG, productName: 'No Product Name' } },
            { link: '', expected: { imageUrl: NOIMAGE_PRODUCT_IMAGE_URL, categoryName: ACTIVE_TAG, productName: 'No Product Name' } },
            { link: '/invalid/path', expected: { imageUrl: undefined, categoryName: ACTIVE_TAG, productName: 'Path' } },
            { link: '/category/', expected: { imageUrl: '', categoryName: ACTIVE_TAG, productName: '' } }
        ]
    
        testCases.forEach(({ link, expected }) => {
            const result = extractSyncLogData(link)
            expect(result).toEqual(expected)
        })
    })

    // カテゴリ名の大文字小文字テスト
    it('should handle different case variations for category names', () => {
        const testCases = [
            { link: '/category/ACTIVE/test', expected: ACTIVE_TAG },
            { link: '/category/Active/test', expected: ACTIVE_TAG },
            { link: '/category/active/test', expected: ACTIVE_TAG },
            { link: '/category/EXPLORER/test', expected: EXPLORER_TAG },
            { link: '/category/Explorer/test', expected: EXPLORER_TAG }
        ]

        testCases.forEach(({ link, expected }) => {
            const result = extractSyncLogData(link)
            expect(result.categoryName).toBe(expected)
        })
    })

    // 空の文字列と null のテスト
    it('should handle empty string and null input', () => {
        const nullResult = extractSyncLogData(null)
        const emptyResult = extractSyncLogData('')

        const expected = {
            imageUrl: NOIMAGE_PRODUCT_IMAGE_URL,
            categoryName: ACTIVE_TAG,
            productName: 'No Product Name'
        }

        expect(nullResult).toEqual(expected)
        expect(emptyResult).toEqual(expected)
    })

    // 例外発生
    it('should default to ACTIVE_TAG for unknown categories', () => {
        const testCases = [
            '/category/unknown/test',
            '/category/invalid/test',
            '/category/xyz/test'
        ]

        testCases.forEach(link => {
            const result = extractSyncLogData(link)
            expect(result.categoryName).toBe(ACTIVE_TAG)
        })
    })
})