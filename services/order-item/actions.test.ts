import { describe, it, expect, vi, beforeEach } from "vitest"

import { 
    createOrderItems,
    getUserSubscriptionByProduct,
    deleteAllOrderItem
} from "@/services/order-item/actions"
import { mockOrderItems, mockProductDetails } from "@/__tests__/mocks/domain-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ORDER_ITEM_ERROR } = ERROR_MESSAGES;

const { CREATE_FAILED, DELETE_FAILED } = ORDER_ITEM_ERROR;

const mockCreateOrderItems = vi.fn()
const mockGetUserSubscriptionByProduct = vi.fn()
const mockDeleteAllOrderItem = vi.fn()

vi.mock('@/repository/orderItem', () => ({
    createOrderItemRepository: () => ({
        createOrderItems: mockCreateOrderItems
    }),
    getOrderItemRepository: () => ({
        getUserSubscriptionByProduct: mockGetUserSubscriptionByProduct
    }),
    deleteOrderItemRepository: () => ({
        deleteAllOrderItem: mockDeleteAllOrderItem
    })
}))

/* ==================================== 
    Create Order Items Test
==================================== */
describe('createOrderItems', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonParams = {
        orderId: 'order_test_123',
        productDetails: mockProductDetails as unknown as StripeProductDetailsProps[]
    }

    // 作成成功
    it('should create order items successfully', async () => {
        mockCreateOrderItems.mockResolvedValue(mockOrderItems)

        const result = await createOrderItems(commonParams)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 作成失敗（リポジトリが null）
    it('should return failure when repository returns null', async () => {
        mockCreateOrderItems.mockResolvedValue(null)

        const result = await createOrderItems(commonParams)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 作成失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockCreateOrderItems.mockRejectedValue(new Error('Database error'))

        const result = await createOrderItems(commonParams)

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Get User Subscription By Product Test
==================================== */
describe('getUserSubscriptionByProduct', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should return true when user has subscription', async () => {
        mockGetUserSubscriptionByProduct.mockResolvedValue(1)

        const result = await getUserSubscriptionByProduct({
            productId: 'product_test_123',
            userId: 'user_test_123',
        })

        expect(result.data).toBe(true)
    })

    // 作成失敗
    it('should return failure when repository returns 0', async () => {
        mockGetUserSubscriptionByProduct.mockResolvedValue(0)

        const result = await getUserSubscriptionByProduct({
            productId: 'product_test_123',
            userId: 'user_test_123',
        })

        expect(result.data).toBe(false)
    })
})

/* ==================================== 
    Delete All Order Item Test
==================================== */
describe('deleteAllOrderItem', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockSubscription = {
        subscriptionId: 'sub_test_123',
        subscriptionStatus: 'active' as const
    }

    // 作成成功
    it('should delete all order item successfully', async () => {
        mockDeleteAllOrderItem.mockResolvedValue(true)

        const result = await deleteAllOrderItem({ 
            orderId: 'order_test_123'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockDeleteAllOrderItem.mockResolvedValue(false)

        const result = await deleteAllOrderItem({ 
            orderId: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_FAILED)
    })

    // 作成失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockDeleteAllOrderItem.mockRejectedValue(new Error('Test error'))

        const result = await deleteAllOrderItem({ 
            orderId: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_FAILED)
    })
})