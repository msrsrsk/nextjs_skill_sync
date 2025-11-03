import { describe, it, expect, vi, beforeEach } from "vitest"

import { 
    createOrder,
    createCheckoutOrder,
    updateProductStockAndSoldCount,
    deleteOrder
} from "@/services/order/actions"
import { mockOrder, mockOrderShipping, mockOrderItems } from "@/__tests__/mocks/domain-mocks"
import { mockCheckoutSession, mockCustomerDetails } from "@/__tests__/mocks/stripe-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ORDER_ERROR, CHECKOUT_ERROR, ORDER_SHIPPING_ERROR, PRODUCT_ERROR } = ERROR_MESSAGES;

const { CREATE_FAILED, DELETE_FAILED, DETAIL_FETCH_FAILED } = ORDER_ERROR;
const { SUBSCRIPTION_SHIPPING_FEE_FAILED, PAYMENT_METHOD_FAILED } = CHECKOUT_ERROR;
const { UPDATE_STOCK_AND_SOLD_COUNT_FAILED } = PRODUCT_ERROR;

const mockCreateOrder = vi.fn()
const mockCreateCheckoutOrder = vi.fn()
const mockUpdateProductStockAndSoldCount = vi.fn()
const mockDeleteOrder = vi.fn()
const mockGetSubscriptionShippingFee = vi.fn()
const mockGetOrderByIdWithOrderItems = vi.fn()

vi.mock('@/repository/order', () => ({
    createOrderRepository: () => ({
        createOrder: mockCreateOrder
    }),
    getOrderRepository: () => ({
        createCheckoutOrder: mockCreateCheckoutOrder,
        getOrderByIdWithOrderItems: mockGetOrderByIdWithOrderItems
    }),
    updateProductStockAndSoldCountRepository: () => ({
        updateProductStockAndSoldCount: mockUpdateProductStockAndSoldCount
    }),
    deleteOrderRepository: () => ({
        deleteOrder: mockDeleteOrder
    })
}))

vi.mock('@/services/stripe/checkout-actions', () => ({
    getSubscriptionShippingFee: vi.fn(),
    getPaymentMethod: vi.fn()
}))

vi.mock('@/services/order-shipping/actions', () => ({
    createOrderShipping: vi.fn()
}))

vi.mock('@/services/product/actions', () => ({
    updateStockAndSoldCount: vi.fn()
}))

const getMockCreateOrderShipping = async () => {
    const { createOrderShipping } = await import('@/services/order-shipping/actions')
    return vi.mocked(createOrderShipping)
}

const getMockSubscriptionShippingFee = async () => {
    const { getSubscriptionShippingFee } = await import('@/services/stripe/checkout-actions')
    return vi.mocked(getSubscriptionShippingFee)
}

const getMockPaymentMethod = async () => {
    const { getPaymentMethod } = await import('@/services/stripe/checkout-actions')
    return vi.mocked(getPaymentMethod)
}

const getMockUpdateStockAndSoldCount = async () => {
    const { updateStockAndSoldCount } = await import('@/services/product/actions')
    return vi.mocked(updateStockAndSoldCount)
}

/* ==================================== 
    Create Order Test
==================================== */
describe('createOrder', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create order items successfully', async () => {
        mockCreateOrder.mockResolvedValue(mockOrder)

        const result = await createOrder({ 
            orderData: mockOrder.order 
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateOrder.mockResolvedValue(null)

        const result = await createOrder({ 
            orderData: null as unknown as CreateOrderData 
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockCreateOrder.mockRejectedValue(new Error('Database error'))

        const result = await createOrder({ 
            orderData: null as unknown as CreateOrderData 
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Create Checkout Order Test
==================================== */
describe('createCheckoutOrder', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockSessionWithCustomerDetails = {
        ...mockCheckoutSession,
        customer_details: mockCustomerDetails
    }

    // 作成成功（サブスクリプションの場合）
    it('should create checkout order successfully when subscription is not null', async () => {
        const mockGetSubscriptionShippingFee = await getMockSubscriptionShippingFee()
        const mockGetPaymentMethod = await getMockPaymentMethod()
        const mockCreateOrderShipping = await getMockCreateOrderShipping()

        mockGetSubscriptionShippingFee.mockResolvedValue({
            success: true,
            error: null,
            data: 500
        })

        mockGetPaymentMethod.mockResolvedValue({
            success: true,
            error: null,
            data: 'card'
        })

        mockCreateOrder.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrder
        })

        mockCreateOrderShipping.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrderShipping
        })

        const result = await createCheckoutOrder({ 
            session: mockSessionWithCustomerDetails 
        })
    
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
        expect(result.data?.order).toBeDefined()
        expect(result.data?.orderShipping).toBeDefined()
    })

    // 作成成功（通常商品の場合）
    it('should create checkout order successfully when subscription is null', async () => {
        const mockCreateOrderShipping = await getMockCreateOrderShipping()

        const mockSessionWithoutSubscription = {
            ...mockSessionWithCustomerDetails,
            subscription: null,
            payment_intent: null
        }

        mockCreateOrder.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrder
        })

        mockCreateOrderShipping.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrderShipping
        })

        const result = await createCheckoutOrder({ 
            session: mockSessionWithoutSubscription 
        })
    
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
        expect(result.data?.order).toBeDefined()
        expect(result.data?.orderShipping).toBeDefined()
        expect(mockGetSubscriptionShippingFee).not.toHaveBeenCalled()
    })

    // 作成失敗（サブスクリプションの有無の確認失敗）
    it('should return failure when subscription shipping fee retrieval fails', async () => {
        const mockGetSubscriptionShippingFee = await getMockSubscriptionShippingFee()

        mockGetSubscriptionShippingFee.mockResolvedValue({
            success: false,
            error: SUBSCRIPTION_SHIPPING_FEE_FAILED,
            data: 0
        })

        const result = await createCheckoutOrder({ 
            session: mockSessionWithCustomerDetails 
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(SUBSCRIPTION_SHIPPING_FEE_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（支払い方法の取得失敗）
    it('should create checkout order successfully when subscription is not null', async () => {
        const mockGetSubscriptionShippingFee = await getMockSubscriptionShippingFee()
        const mockGetPaymentMethod = await getMockPaymentMethod()

        const mockSessionWithPaymentIntent = {
            ...mockSessionWithCustomerDetails,
            subscription: 'sub_test_123',
            payment_intent: 'pi_test_123'
        }

        mockGetSubscriptionShippingFee.mockResolvedValue({
            success: true,
            error: null,
            data: 500
        })

        mockGetPaymentMethod.mockResolvedValue({
            success: false,
            error: PAYMENT_METHOD_FAILED,
            data: 'card'
        })

        const result = await createCheckoutOrder({ 
            session: mockSessionWithPaymentIntent 
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(PAYMENT_METHOD_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（注文データの作成失敗）
    it('should return failure when order data creation fails', async () => {
        const mockGetSubscriptionShippingFee = await getMockSubscriptionShippingFee()
        const mockGetPaymentMethod = await getMockPaymentMethod()

        mockGetSubscriptionShippingFee.mockResolvedValue({
            success: true,
            error: null,
            data: 500
        })

        mockGetPaymentMethod.mockResolvedValue({
            success: true,
            error: null,
            data: 'card'
        })

        mockCreateOrder.mockResolvedValue(null)

        const result = await createCheckoutOrder({ 
            session: mockSessionWithCustomerDetails 
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（customer_details が不足している場合）
    it('should return failure when customer_details is missing', async () => {
        const mockGetSubscriptionShippingFee = await getMockSubscriptionShippingFee()
        const mockGetPaymentMethod = await getMockPaymentMethod()
        const mockCreateOrderShipping = await getMockCreateOrderShipping()

        mockGetSubscriptionShippingFee.mockResolvedValue({
            success: true,
            error: null,
            data: 500
        })

        mockGetPaymentMethod.mockResolvedValue({
            success: true,
            error: null,
            data: 'card'
        })

        mockCreateOrder.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrder
        })

        mockCreateOrderShipping.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrderShipping
        })

        const result = await createCheckoutOrder({ 
            session: mockCheckoutSession
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(ORDER_SHIPPING_ERROR.CREATE_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（注文配送情報の作成失敗）
    it('should return failure when order shipping creation fails', async () => {
        const mockGetSubscriptionShippingFee = await getMockSubscriptionShippingFee()
        const mockGetPaymentMethod = await getMockPaymentMethod()
        const mockCreateOrderShipping = await getMockCreateOrderShipping()

        mockGetSubscriptionShippingFee.mockResolvedValue({
            success: true,
            error: null,
            data: 500
        })

        mockGetPaymentMethod.mockResolvedValue({
            success: true,
            error: null,
            data: 'card'
        })

        mockCreateOrder.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrder
        })

        mockCreateOrderShipping.mockResolvedValue({
            success: false,
            error: ORDER_SHIPPING_ERROR.CREATE_FAILED,
            data: null
        })

        const result = await createCheckoutOrder({ 
            session: mockSessionWithCustomerDetails
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(ORDER_SHIPPING_ERROR.CREATE_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（サブスクリプションの有無の確認失敗の例外発生）
    it('should return failure when subscription shipping fee retrieval fails (exception)', async () => {
        const mockGetSubscriptionShippingFee = await getMockSubscriptionShippingFee()

        mockGetSubscriptionShippingFee.mockRejectedValue(
            new Error('Database error')
        )

        const result = await createCheckoutOrder({ 
            session: mockSessionWithCustomerDetails 
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.data).toBeNull()
    })

    // 作成失敗（支払い方法の取得失敗の例外発生）
    it('should return failure when payment method retrieval fails (exception)', async () => {
        const mockGetSubscriptionShippingFee = await getMockSubscriptionShippingFee()
        const mockGetPaymentMethod = await getMockPaymentMethod()

        const mockSessionWithPaymentIntent = {
            ...mockSessionWithCustomerDetails,
            subscription: 'sub_test_123',
            payment_intent: 'pi_test_123'
        }

        mockGetSubscriptionShippingFee.mockResolvedValue({
            success: true,
            error: null,
            data: 500
        })

        mockGetPaymentMethod.mockRejectedValue(
            new Error('Database error')
        )

        const result = await createCheckoutOrder({ 
            session: mockSessionWithPaymentIntent 
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.data).toBeNull()
    })

    // 作成失敗（注文データの作成失敗の例外発生）
    it('should return failure when order data creation fails (exception)', async () => {
        const mockGetSubscriptionShippingFee = await getMockSubscriptionShippingFee()
        const mockGetPaymentMethod = await getMockPaymentMethod()

        mockGetSubscriptionShippingFee.mockResolvedValue({
            success: true,
            error: null,
            data: 500
        })

        mockGetPaymentMethod.mockResolvedValue({
            success: true,
            error: null,
            data: 'card'
        })

        mockCreateOrder.mockRejectedValue(new Error('Database error'))

        const result = await createCheckoutOrder({ 
            session: mockSessionWithCustomerDetails 
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（注文配送情報の作成失敗の例外発生）
    it('should return failure when order shipping creation fails (exception)', async () => {
        const mockGetSubscriptionShippingFee = await getMockSubscriptionShippingFee()
        const mockGetPaymentMethod = await getMockPaymentMethod()
        const mockCreateOrderShipping = await getMockCreateOrderShipping()

        mockGetSubscriptionShippingFee.mockResolvedValue({
            success: true,
            error: null,
            data: 500
        })

        mockGetPaymentMethod.mockResolvedValue({
            success: true,
            error: null,
            data: 'card'
        })

        mockCreateOrder.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrder
        })

        mockCreateOrderShipping.mockRejectedValue(new Error('Database error'))

        const result = await createCheckoutOrder({ 
            session: mockSessionWithCustomerDetails
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Update Product Stock And Sold Count Test
==================================== */
describe('updateProductStockAndSoldCount', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockOrderWithItems = {
        id: 'order_test_123',
        order_items: mockOrderItems
    }

    // 更新成功
    it('should update product stock and sold count successfully', async () => {
        const mockUpdateStockAndSoldCount = await getMockUpdateStockAndSoldCount()

        mockGetOrderByIdWithOrderItems.mockResolvedValue(mockOrderWithItems)
        mockUpdateStockAndSoldCount.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await updateProductStockAndSoldCount({ 
            orderId: 'order_test_123' 
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 更新失敗（注文データの取得失敗）
    it('should return failure when order data retrieval fails', async () => {
        const mockUpdateStockAndSoldCount = await getMockUpdateStockAndSoldCount()

        mockGetOrderByIdWithOrderItems.mockResolvedValue(null)
        mockUpdateStockAndSoldCount.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await updateProductStockAndSoldCount({ 
            orderId: 'order_test_123' 
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(DETAIL_FETCH_FAILED)
    })

    // 更新失敗（商品の在庫数と売り上げ数の更新失敗）
    it('should return failure when stock and sold count update fails', async () => {
        const mockUpdateStockAndSoldCount = await getMockUpdateStockAndSoldCount()

        mockGetOrderByIdWithOrderItems.mockResolvedValue(mockOrderWithItems)
        mockUpdateStockAndSoldCount.mockResolvedValue({
            success: false,
            error: UPDATE_STOCK_AND_SOLD_COUNT_FAILED
        })

        const result = await updateProductStockAndSoldCount({ 
            orderId: 'order_test_123' 
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(UPDATE_STOCK_AND_SOLD_COUNT_FAILED)
    })

    // 更新失敗（注文データの取得失敗の例外発生）
    it('should return failure when order data retrieval fails (exception)', async () => {
        mockGetOrderByIdWithOrderItems.mockRejectedValue(
            new Error('Database error')
        )
    
        const result = await updateProductStockAndSoldCount({ 
            orderId: 'order_test_123' 
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
    })

    // 更新失敗（商品の在庫数と売り上げ数の更新失敗の例外発生）
    it('should return failure when stock and sold count update fails (exception)', async () => {
        const mockUpdateStockAndSoldCount = await getMockUpdateStockAndSoldCount()

        mockGetOrderByIdWithOrderItems.mockResolvedValue(mockOrderWithItems)
        mockUpdateStockAndSoldCount.mockRejectedValue(
            new Error('Database error')
        )

        const result = await updateProductStockAndSoldCount({ 
            orderId: 'order_test_123' 
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
    })
})

/* ==================================== 
    Delete Order Test
==================================== */
describe('deleteOrder', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 削除成功
    it('should delete order successfully', async () => {
        mockDeleteOrder.mockResolvedValue(true)

        const result = await deleteOrder({ 
            orderId: 'order_test_123' 
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 削除失敗
    it('should return failure when repository fails', async () => {
        mockDeleteOrder.mockResolvedValue(false)

        const result = await deleteOrder({ 
            orderId: 'order_test_123' 
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_FAILED)
    })

    // 削除失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockDeleteOrder.mockRejectedValue(new Error('Database error'))

        const result = await deleteOrder({ 
            orderId: 'order_test_123' 
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_FAILED)
    })
})