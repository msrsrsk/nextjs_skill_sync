import { describe, it, expect, vi, beforeEach } from "vitest"

import { createOrderStripe, deleteOrderStripe } from "@/services/order-stripe/actions"
import { mockOrderStripe } from "@/__tests__/mocks/domain-mocks"

const mockCreateOrderStripe = vi.fn()
const mockDeleteOrderStripe = vi.fn()

vi.mock('@/repository/orderStripe', () => ({
    createOrderStripeRepository: () => ({
        createOrderStripe: mockCreateOrderStripe
    }),
    deleteOrderStripeRepository: () => ({
        deleteOrderStripe: mockDeleteOrderStripe
    })
}))

/* ==================================== 
    Create Order Stripe Test
==================================== */
describe('createOrderStripe', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create order stripe successfully', async () => {
        mockCreateOrderStripe.mockResolvedValue(true)

        const result = await createOrderStripe({ 
            orderStripeData: mockOrderStripe 
        })

        expect(result.success).toBe(true)
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateOrderStripe.mockResolvedValue(null)

        const result = await createOrderStripe({ 
            orderStripeData: mockOrderStripe 
        })

        expect(result.success).toBe(false)
    })
})

/* ==================================== 
    Delete Order Stripe Test
==================================== */
describe('deleteOrderStripe', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 削除成功
    it('should delete order stripe successfully', async () => {
        mockDeleteOrderStripe.mockResolvedValue(true)

        const result = await deleteOrderStripe({ 
            orderId: 'order_123' 
        })

        expect(result.success).toBe(true)
    })

    // 削除失敗
    it('should return failure when repository fails', async () => {
        mockDeleteOrderStripe.mockResolvedValue(null)

        const result = await deleteOrderStripe({ 
            orderId: 'order_123' 
        })

        expect(result.success).toBe(false)
    })
})