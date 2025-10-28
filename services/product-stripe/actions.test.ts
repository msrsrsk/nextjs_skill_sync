import { describe, it, expect, vi, beforeEach } from "vitest"

import { updateProductStripe } from "@/services/product-stripe/actions"

const mockUpdateProductStripe = vi.fn()

vi.mock('@/repository/productStripe', () => ({
    updateProductStripeRepository: () => ({
        updateProductStripe: mockUpdateProductStripe
    })
}))

/* ==================================== 
    Update Product Stripe Test
==================================== */
describe('updateProductStripe', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 更新成功
    it('should update product stripe successfully', async () => {
        mockUpdateProductStripe.mockResolvedValue(true)

        const result = await updateProductStripe({
            productId: 'test-product-id',
            data: {
                stripe_product_id: 'test-stripe-product-id',
                regular_price_id: 'test-regular-price-id'
            }
        })

        expect(result.success).toBe(true)
    })

    // 更新失敗
    it('should update product stripe failed', async () => {
        mockUpdateProductStripe.mockResolvedValue(false)

        const result = await updateProductStripe({
            productId: 'test-product-id',
            data: {
                stripe_product_id: 'test-stripe-product-id',
                regular_price_id: 'test-regular-price-id'
            }
        })

        expect(result.success).toBe(false)
    })
})