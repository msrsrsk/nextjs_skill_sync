import { describe, it, expect, vi, beforeEach } from "vitest"

import { createOrderItemStripes, deleteOrderItemStripes } from "@/services/order-item-stripe/actions"
import { mockOrderItemStripes, mockProductDetails } from "@/__tests__/mocks/domain-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ORDER_ITEM_STRIPE_ERROR } = ERROR_MESSAGES;

const { CREATE_FAILED, DELETE_FAILED } = ORDER_ITEM_STRIPE_ERROR;

const mockCreateOrderItemStripe = vi.fn()
const mockDeleteOrderItemStripe = vi.fn()

vi.mock('@/repository/orderItemStripe', () => ({
    createOrderItemStripeRepository: () => ({
        createOrderItemStripe: mockCreateOrderItemStripe
    }),
    deleteOrderItemStripeRepository: () => ({
        deleteOrderItemStripe: mockDeleteOrderItemStripe
    })
}))

/* ==================================== 
    Create Order Item Stripes Test
==================================== */
describe('createOrderItemStripes', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create order item stripe successfully with single product', async () => {
        mockCreateOrderItemStripe.mockResolvedValue(mockOrderItemStripes)

        const orderItemIds = ['order_item_1']

        const result = await createOrderItemStripes({
            orderItemIds,
            productDetails: mockProductDetails as unknown as StripeProductDetailsProps[]
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(mockCreateOrderItemStripe).toHaveBeenCalledTimes(2)
    })

    // 作成失敗（有効な商品データがない場合）
    it('should return failure when no valid products exist', async () => {
        mockCreateOrderItemStripe.mockResolvedValue(mockOrderItemStripes)

        const orderItemIds = ['order_item_1']

        const productDetails = [
            ...mockProductDetails,
            {
                ...mockProductDetails[0],
                product_id: null,
            }
        ]

        const result = await createOrderItemStripes({
            orderItemIds,
            productDetails: productDetails as unknown as StripeProductDetailsProps[]
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(mockCreateOrderItemStripe).toHaveBeenCalledTimes(2)
    })

    // 作成失敗（例外発生）
    it('should create order item stripe successfully with single product', async () => {
        mockCreateOrderItemStripe.mockRejectedValue(new Error('Test error'))

        const orderItemIds = ['order_item_1']

        const result = await createOrderItemStripes({
            orderItemIds,
            productDetails: mockProductDetails as unknown as StripeProductDetailsProps[]
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
        expect(mockCreateOrderItemStripe).toHaveBeenCalledTimes(2)
    })
})

/* ==================================== 
    Delete Order Item Stripes Test
==================================== */
describe('deleteOrderItemStripes', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should delete order item stripe successfully', async () => {
        mockDeleteOrderItemStripe.mockResolvedValue(true)

        const result = await deleteOrderItemStripes({ 
            orderItemId: 'order_item_1' }
        )

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockDeleteOrderItemStripe.mockRejectedValue(false)

        const result = await deleteOrderItemStripes({ 
            orderItemId: 'order_item_1' 
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_FAILED)
    })

    // 作成失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockDeleteOrderItemStripe.mockRejectedValue(new Error('Test error'))

        const result = await deleteOrderItemStripes({ 
            orderItemId: 'order_item_1' 
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_FAILED)
    })
})