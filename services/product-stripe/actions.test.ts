import { describe, it, expect, vi, beforeEach } from "vitest"

import { updateProductStripe } from "@/services/product-stripe/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PRODUCT_STRIPE_ERROR } = ERROR_MESSAGES;
const { UPDATE_FAILED } = PRODUCT_STRIPE_ERROR;

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
        expect(result.error).toBeNull()
    })

    // 更新失敗
    it('should update product stripe failed', async () => {
        mockUpdateProductStripe.mockResolvedValue(false)

        const result = await updateProductStripe({
            productId: 'test-product-id',
            data: {
                stripe_product_id: null,
                regular_price_id: null
            }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(UPDATE_FAILED)
    })

    // 更新失敗(例外発生)
    it('should return failure when exception occurs', async () => {
        mockUpdateProductStripe.mockRejectedValue(new Error('Database error'))

        const result = await updateProductStripe({
            productId: 'test-product-id',
            data: {
                stripe_product_id: null,
                regular_price_id: null
            }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(UPDATE_FAILED)
    })
})