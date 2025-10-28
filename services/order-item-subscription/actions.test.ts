import { describe, it, expect, vi, beforeEach } from "vitest"

import { 
    createOrderItemSubscriptions,
    updateOrderItemSubscriptionStatus,
} from "@/services/order-item-subscription/actions"
import { mockOrderItemSubscriptions, mockSubscriptionProductDetails } from "@/__tests__/mocks/domain-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SUBSCRIPTION_ERROR } = ERROR_MESSAGES;

const { CREATE_FAILED } = SUBSCRIPTION_ERROR;

const mockCreateOrderItemSubscriptions = vi.fn()
const mockUpdateOrderItemSubscriptionStatus = vi.fn()
const mockDeleteOrderItemSubscription = vi.fn()

vi.mock('@/repository/orderItemSubscription', () => ({
    createOrderItemSubscriptionRepository: () => ({
        createOrderItemSubscriptions: mockCreateOrderItemSubscriptions
    }),
    updateOrderItemSubscriptionRepository: () => ({
        updateSubscriptionStatus: mockUpdateOrderItemSubscriptionStatus
    }),
    deleteOrderItemSubscriptionRepository: () => ({
        deleteOrderItemSubscription: mockDeleteOrderItemSubscription
    })
}))

vi.mock('@/services/order-item-subscription/format', () => ({
    formatOrderRemarks: vi.fn().mockReturnValue('月額サブスクリプション')
}))

/* ==================================== 
    Create Order Item Subscriptions Test
==================================== */
describe('createOrderItemSubscriptions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create order item subscriptions successfully', async () => {
        mockCreateOrderItemSubscriptions.mockResolvedValue(mockOrderItemSubscriptions)

        const result = await createOrderItemSubscriptions({
            orderItemId: 'order_item_123',
            productDetails: mockSubscriptionProductDetails
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toEqual(mockOrderItemSubscriptions)
        expect(mockCreateOrderItemSubscriptions).toHaveBeenCalledWith({
            subscriptionData: {
                order_item_id: 'order_item_123',
                subscription_id: 'sub_test_123',
                status: 'active',
                interval: '1month',
                remarks: '月額サブスクリプション'
            }
        })
    })

    // 作成失敗（有効な商品データがない場合）
    it('should handle case when no valid products exist', async () => {
        const productDetails = [
            {
                ...mockSubscriptionProductDetails[0],
                product_id: null,
            }
        ] as unknown as StripeProductDetailsProps[]
    
        const result = await createOrderItemSubscriptions({
            orderItemId: 'order_item_123',
            productDetails: productDetails
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockCreateOrderItemSubscriptions.mockRejectedValue(
            new Error('Test error')
        )

        const result = await createOrderItemSubscriptions({
            orderItemId: 'order_item_123',
            productDetails: mockSubscriptionProductDetails
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Update Order Item Subscription Status Test
==================================== */
describe('updateOrderItemSubscriptionStatus', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockSubscription = {
        subscriptionId: 'sub_test_123',
        subscriptionStatus: 'active' as const
    }

    // 作成成功
    it('should update order item subscription status successfully', async () => {
        mockUpdateOrderItemSubscriptionStatus.mockResolvedValue(true)

        const result = await updateOrderItemSubscriptionStatus(mockSubscription)

        expect(result.success).toBe(true)
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockUpdateOrderItemSubscriptionStatus.mockResolvedValue(null)

        const result = await updateOrderItemSubscriptionStatus(mockSubscription)

        expect(result.success).toBe(false)
    })
})