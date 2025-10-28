import { describe, it, expect, vi, beforeEach } from "vitest"

import { extractProductLink } from "@/services/product/extractors"

/* ==================================== 
    extractProductLink Test
==================================== */
describe('extractProductLink', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 基本的な成功ケース
    it('should extract product link from valid HTML', () => {
        const content = '<a href="https://example.com/product/123">商品を見る</a>'
        const result = extractProductLink(content)
        expect(result).toBe('https://example.com/product/123')
    })

    // 属性の順序が異なる場合
    it('should extract link when attributes are in different order', () => {
        const content = '<a class="btn" href="https://example.com/product/456" id="link">商品を見る</a>'
        const result = extractProductLink(content)
        expect(result).toBe('https://example.com/product/456')
    })

    // 複数の属性がある場合
    it('should extract link with multiple attributes', () => {
        const content = '<a href="https://example.com/product/789" class="product-link" target="_blank" rel="noopener">商品を見る</a>'
        const result = extractProductLink(content)
        expect(result).toBe('https://example.com/product/789')
    })

    // マッチしないケース
    it('should return null when no product link found', () => {
        const content = '<div>No product link here</div>'
        const result = extractProductLink(content)
        expect(result).toBeNull()
    })

    // テキストが異なる場合
    it('should return null when link text is different', () => {
        const content = '<a href="https://example.com/product/123">View Product</a>'
        const result = extractProductLink(content)
        expect(result).toBeNull()
    })

    // href属性がない場合
    it('should return null when href attribute is missing', () => {
        const content = '<a class="btn">商品を見る</a>'
        const result = extractProductLink(content)
        expect(result).toBeNull()
    })

    // 空のhref属性
    it('should return null when href is empty', () => {
        const content = '<a href="">商品を見る</a>'
        const result = extractProductLink(content)
        expect(result).toBeNull()
    })

    // 空文字列や null の場合
    it('should return null for empty content', () => {
        expect(extractProductLink('')).toBeNull()
        expect(extractProductLink(null as any)).toBeNull()
        expect(extractProductLink(undefined as any)).toBeNull()
    })

    // 複数のリンクがある場合（最初のマッチを返す）
    it('should return first matching link when multiple links exist', () => {
        const content = `
            <a href="https://example.com/product/111">商品を見る</a>
            <a href="https://example.com/product/222">商品を見る</a>
        `
        const result = extractProductLink(content)
        expect(result).toBe('https://example.com/product/111')
    })

    // 改行や空白が含まれる場合
    it('should handle content with whitespace and newlines', () => {
        const content = `
            <div>
                <a href="https://example.com/product/123">
                    商品を見る
                </a>
            </div>
        `
        const result = extractProductLink(content)
        expect(result).toBeNull()
    })
})