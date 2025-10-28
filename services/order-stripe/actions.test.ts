import { describe, it, expect, vi, beforeEach } from "vitest"

import { createOrderStripe, deleteOrderStripe } from "@/services/order-stripe/actions"
import { mockOrderStripe } from "@/__tests__/mocks/domain-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ORDER_STRIPE_ERROR } = ERROR_MESSAGES;

const { CREATE_FAILED, DELETE_FAILED } = ORDER_STRIPE_ERROR;

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
        expect(result.error).toBeNull()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateOrderStripe.mockResolvedValue(false)

        const result = await createOrderStripe({ 
            orderStripeData: mockOrderStripe 
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
    })

    // 作成失敗(例外発生)
    it('should return failure when exception occurs', async () => {
        mockCreateOrderStripe.mockRejectedValue(new Error('Database error'))

        const result = await createOrderStripe({ 
            orderStripeData: mockOrderStripe 
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
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
        expect(result.error).toBeNull()
    })

    // 削除失敗
    it('should return failure when repository fails', async () => {
        mockDeleteOrderStripe.mockResolvedValue(false)

        const result = await deleteOrderStripe({ 
            orderId: 'order_123' 
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_FAILED)
    })

    // 削除失敗(例外発生)
    it('should return failure when exception occurs', async () => {
        mockDeleteOrderStripe.mockRejectedValue(new Error('Database error'))

        const result = await deleteOrderStripe({ 
            orderId: 'order_123' 
        })
        
        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_FAILED)
    })
})