import { describe, it, expect, vi, beforeEach } from "vitest"

import { processProductWebhook } from "@/services/product/webhook-actions"
import { getProductByProductId } from "@/services/product/actions"
import { createStripeProductData } from "@/services/stripe/webhook-actions"
import { updateProductStripe } from "@/services/product-stripe/actions"
import { mockProduct as mockStripeProduct, mockPrice } from "@/__tests__/mocks/stripe-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PRODUCT_ERROR, PRODUCT_STRIPE_ERROR } = ERROR_MESSAGES;
const { FETCH_FAILED } = PRODUCT_ERROR;
const { UPDATE_FAILED } = PRODUCT_STRIPE_ERROR;

vi.mock('@/services/product/actions', () => ({
    getProductByProductId: vi.fn()
}))

vi.mock('@/services/stripe/webhook-actions', () => ({
    createStripeProductData: vi.fn()
}))

vi.mock('@/services/product-stripe/actions', () => ({
    updateProductStripe: vi.fn()
}))

/* ==================================== 
    processProductWebhook Test
==================================== */
describe('processProductWebhook', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockProduct = {
        title: 'Test Product',
        price: 1000,
        product_pricings: {
            sale_price: 800
        }
    }

    // 処理成功（通常商品の場合）
    it('should process product webhook successfully', async () => {
        const mockGetProductByProductId = vi.mocked(getProductByProductId)
        const mockCreateStripeProductData = vi.mocked(createStripeProductData)
        const mockUpdateProductStripe = vi.mocked(updateProductStripe)

        mockGetProductByProductId.mockResolvedValue({
            data: mockProduct
        })

        mockCreateStripeProductData.mockResolvedValue({
            productData: mockStripeProduct, 
            priceData: mockPrice,
            stripeSalePriceId: mockPrice.id,
            updatedSubscriptionPriceIds: null
        })

        mockUpdateProductStripe.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await processProductWebhook({
            product_id: 'prod_test_123',
            subscriptionPriceIds: null
        })

        expect(result.success).toBe(true)
        expect(result.error).toBe(null)
    })

    // 処理成功（サブスクリプション価格がある場合）
    it('should process product webhook successfully with subscription prices', async () => {
        const mockGetProductByProductId = vi.mocked(getProductByProductId)
        const mockCreateStripeProductData = vi.mocked(createStripeProductData)
        const mockUpdateProductStripe = vi.mocked(updateProductStripe)

        mockGetProductByProductId.mockResolvedValue({
            data: mockProduct
        })

        mockCreateStripeProductData.mockResolvedValue({
            productData: mockStripeProduct,
            priceData: mockPrice,
            stripeSalePriceId: null,
            updatedSubscriptionPriceIds: 'price_sub_123\nprice_sub_456'
        })

        mockUpdateProductStripe.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await processProductWebhook({
            product_id: 'prod_test_123',
            subscriptionPriceIds: 'price_sub_123\nprice_sub_456'
        })

        expect(result.success).toBe(true)
        expect(mockUpdateProductStripe).toHaveBeenCalledWith({
            productId: 'prod_test_123',
            data: {
                stripe_product_id: mockStripeProduct.id,
                regular_price_id: mockPrice.id,
                subscription_price_ids: 'price_sub_123\nprice_sub_456'
            }
        })
    })

    // 処理失敗（商品データ取得失敗）
    it('should process product webhook failed with product data not found', async () => {
        const mockGetProductByProductId = vi.mocked(getProductByProductId)

        mockGetProductByProductId.mockResolvedValue({
            data: null
        })

        const result = await processProductWebhook({
            product_id: 'prod_test_123',
            subscriptionPriceIds: null
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(FETCH_FAILED)
    })

    // 処理失敗（Stripe データ作成失敗）
    it('should process product webhook failed with stripe data creation failed', async () => {
        const mockGetProductByProductId = vi.mocked(getProductByProductId)
        const mockCreateStripeProductData = vi.mocked(createStripeProductData)

        mockGetProductByProductId.mockResolvedValue({
            data: mockProduct
        })

        mockCreateStripeProductData.mockRejectedValue(
            new Error('Stripe API error')
        )

        await expect(processProductWebhook({
            product_id: 'prod_test_123',
            subscriptionPriceIds: null
        })).rejects.toThrow('Stripe API error')
    })

    // 処理失敗（Stripe 商品のデータ更新失敗）
    it('should process product webhook successfully', async () => {
        const mockGetProductByProductId = vi.mocked(getProductByProductId)
        const mockCreateStripeProductData = vi.mocked(createStripeProductData)
        const mockUpdateProductStripe = vi.mocked(updateProductStripe)

        mockGetProductByProductId.mockResolvedValue({
            data: mockProduct
        })

        mockCreateStripeProductData.mockResolvedValue({
            productData: mockStripeProduct, 
            priceData: mockPrice,
            stripeSalePriceId: mockPrice.id,
            updatedSubscriptionPriceIds: null
        })

        mockUpdateProductStripe.mockResolvedValue({
            success: false,
            error: UPDATE_FAILED
        })

        const result = await processProductWebhook({
            product_id: 'prod_test_123',
            subscriptionPriceIds: null
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(UPDATE_FAILED)
    })
})