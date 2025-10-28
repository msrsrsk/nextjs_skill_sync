import { describe, it, expect, vi, beforeEach } from "vitest"

import { createOrderShipping } from "@/services/order-shipping/actions"
import { mockOrderShipping } from "@/__tests__/mocks/domain-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ORDER_SHIPPING_ERROR } = ERROR_MESSAGES;

const { CREATE_FAILED } = ORDER_SHIPPING_ERROR;

const mockCreateOrderShipping = vi.fn()

vi.mock('@/repository/orderShipping', () => ({
    createOrderShippingRepository: () => ({
        createOrderShipping: mockCreateOrderShipping
    })
}))

/* ==================================== 
    Create Order Shipping Test
==================================== */
describe('createOrderShipping', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create order shipping successfully', async () => {
        mockCreateOrderShipping.mockResolvedValue(true)

        const result = await createOrderShipping({
            orderShippingData: mockOrderShipping as CreateOrderShippingData
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateOrderShipping.mockResolvedValue(false)

        const result = await createOrderShipping({
            orderShippingData: null as unknown as CreateOrderShippingData
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗(例外発生)
    it('should return failure when exception occurs', async () => {
        mockCreateOrderShipping.mockRejectedValue(new Error('Database error'))

        const result = await createOrderShipping({
            orderShippingData: null as unknown as CreateOrderShippingData
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
        expect(result.data).toBeNull()
    })
})