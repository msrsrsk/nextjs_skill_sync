import { describe, it, expect, vi, beforeEach } from "vitest"

import { createOrderShipping } from "@/services/order-shipping/actions"
import { mockOrderShipping } from "@/__tests__/mocks/domain-mocks"

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
        expect(result.data).toBeDefined()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateOrderShipping.mockResolvedValue(null)

        const result = await createOrderShipping({
            orderShippingData: mockOrderShipping as CreateOrderShippingData
        })

        expect(result.success).toBe(false)
        expect(result.data).toBeNull()
    })
})