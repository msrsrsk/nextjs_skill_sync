import { describe, it, expect, vi, beforeEach } from "vitest"

import { 
    createProductDetails,
    processOrderData,
    processShippingAddress,
    sendOrderEmails,
    handleSubscriptionEvent,
    handleSubscriptionUpdate,
    createStripeProductData,
    processSubscriptionWebhook
} from "@/services/stripe/webhook-actions"
import { getCheckoutSession } from "@/services/stripe/checkout-actions"
import { createCheckoutOrder, deleteOrder } from "@/services/order/actions"
import { createOrderStripe, deleteOrderStripe } from "@/services/order-stripe/actions"
import { createOrderItems, deleteAllOrderItem } from "@/services/order-item/actions"
import { createOrderItemStripes, deleteOrderItemStripes } from "@/services/order-item-stripe/actions"
import { createOrderItemSubscriptions } from "@/services/order-item-subscription/actions"
import { getDefaultShippingAddress, createShippingAddress } from "@/services/shipping-address/actions"
import { createStripeProduct, createStripePrice, createSubscriptionPrices, updateCustomerShippingAddress } from "@/services/stripe/actions"
import { sendPaymentRequestEmail } from "@/services/email/order/payment-request"
import { sendSubscriptionPaymentRequestEmail } from "@/services/email/subscription/subscription-payment-request"
import { formatStripeSubscriptionStatus } from "@/services/subscription-payment/format"
import { createSubscriptionPayment, updateSubscriptionPaymentStatus } from "@/services/subscription-payment/actions"
import { 
    mockLineItems, 
    mockStripeClient,
    mockCheckoutSession,
    mockSubscriptionLineItems,
    mockCustomer,
    mockPaymentIntent,
    mockSubscription,
    mockSubscriptionItems,
    mockPrice,
    mockInvoice,
} from "@/__tests__/mocks/stripe-mocks"
import { 
    mockOrder, 
    mockOrderItems, 
    mockOrderItemStripes,
    mockOrderItemSubscriptions,
    mockShippingAddress,
    mockSubscriptionProductDetails,
    mockSubscriptionPayment,
    mockStripeProduct
} from "@/__tests__/mocks/domain-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { 
    CHECKOUT_ERROR, 
    ORDER_STRIPE_ERROR, 
    ORDER_ITEM_ERROR,
    ORDER_ITEM_STRIPE_ERROR,
    SUBSCRIPTION_ERROR,
    SHIPPING_ADDRESS_ERROR,
    EMAIL_ERROR,
    SUBSCRIPTION_PAYMENT_ERROR,
    STRIPE_ERROR
} = ERROR_MESSAGES;

const { 
    CHECKOUT_PRODUCT_CREATE_FAILED,
    CREATE_ORDER_FAILED
} = CHECKOUT_ERROR;
const { 
    PAYMENT_REQUEST_SEND_FAILED, 
    SUBSCRIPTION_PAYMENT_REQUEST_SEND_FAILED 
} = EMAIL_ERROR;
const { PRICE_CREATE_FAILED } = STRIPE_ERROR;

vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_1234567890')
vi.stubEnv('STRIPE_WEBHOOK_SECRET', 'whsec_test_1234567890')
vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.com')

vi.mock('@/lib/clients/stripe/client', () => ({
    stripe: {
        products: { retrieve: vi.fn() },
        prices: { retrieve: vi.fn() },
        checkout: {
            sessions: {
                retrieve: vi.fn()
            }
        },
        paymentIntents: {
            retrieve: vi.fn()
        },
        subscriptions: {
            retrieve: vi.fn()
        }
    }
}))

vi.mock('@/services/stripe/checkout-actions', () => ({
    getCheckoutSession: vi.fn()
}))

vi.mock('@/services/order/actions', () => ({
    createCheckoutOrder: vi.fn(),
    deleteOrder: vi.fn()
}))

vi.mock('@/services/order-stripe/actions', () => ({
    createOrderStripe: vi.fn(),
    deleteOrderStripe: vi.fn()
}))

vi.mock('@/services/order-item/actions', () => ({
    createOrderItems: vi.fn(),
    deleteAllOrderItem: vi.fn()
}))

vi.mock('@/services/order-item-stripe/actions', () => ({
    createOrderItemStripes: vi.fn(),
    deleteOrderItemStripes: vi.fn()
}))

vi.mock('@/services/order-item-subscription/actions', () => ({
    createOrderItemSubscriptions: vi.fn()
}))

vi.mock('@/services/shipping-address/actions', () => ({
    getDefaultShippingAddress: vi.fn(),
    createShippingAddress: vi.fn()
}))

vi.mock('@/services/stripe/actions', () => ({
    createStripeProduct: vi.fn(),
    createStripePrice: vi.fn(),
    createSubscriptionPrices: vi.fn(),
    updateCustomerShippingAddress: vi.fn()
}))

vi.mock('@/services/email/order/payment-request', () => ({
    sendPaymentRequestEmail: vi.fn()
}))

vi.mock('@/services/subscription-payment/actions', () => ({
    createSubscriptionPayment: vi.fn(),
    updateSubscriptionPaymentStatus: vi.fn()
}))

vi.mock('@/services/email/subscription/subscription-payment-request', () => ({
    sendSubscriptionPaymentRequestEmail: vi.fn()
}))

vi.mock('@/services/subscription-payment/format', () => ({
    formatStripeSubscriptionStatus: vi.fn()
}))

const getMockStripe = async () => {
    const { stripe } = await import('@/lib/clients/stripe/client')
    return vi.mocked(stripe)
}

/* ==================================== 
    Create Product Details Test
==================================== */
describe('createProductDetails', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
        
        const stripe = await getMockStripe()

        vi.mocked(stripe.products.retrieve).mockResolvedValue({
            ...mockStripeClient
        })
    })

    // 作成成功（通常商品の場合）
    it('should create product details successfully for regular products', async () => {
        const result = await createProductDetails({
            lineItems: mockLineItems,
            subscriptionId: 'sub_test_123',
            isCheckout: true
        })

        expect(result.success).toBe(true)
        expect(Array.isArray(result.data)).toBe(true)
        
        const item = result.data?.[0]
        expect(item).toHaveProperty('product_id', 'product_test_123')
        expect(item).toHaveProperty('image', 'https://example.com/image.jpg')
        expect(item).toHaveProperty('unit_price', mockLineItems[0].price?.unit_amount)
        expect(item).toHaveProperty('amount', mockLineItems[0].amount_total)
        expect(item).toHaveProperty('quantity', mockLineItems[0].quantity)
        expect(item).toHaveProperty('stripe_price_id', mockLineItems[0].price?.id)
        expect(item).toHaveProperty('subscription_id', 'sub_test_123')
        expect(item).toHaveProperty('subscription_status', null)
        expect(item).toHaveProperty('subscription_interval', null)
        expect(item).toHaveProperty('title', 'Test Product')
    })

    // 作成成功（サブスクリプション商品の場合）
    it('should create product details successfully for subscription products', async () => {
        const stripe = await getMockStripe()
        
        vi.mocked(stripe.products.retrieve).mockResolvedValue({
            ...mockStripeClient,
            id: 'prod_subscription_123',
            description: 'Subscription Product',
            images: ['https://example.com/subscription.jpg'],
            metadata: {
                supabase_id: 'subscription_product_123',
                subscription_product: 'true'
            },
            name: 'Subscription Product'
        })

        const result = await createProductDetails({
            lineItems: mockSubscriptionLineItems.line_items.data,
            subscriptionId: 'sub_test_123',
            isCheckout: true
        })

        expect(result.success).toBe(true)
        expect(Array.isArray(result.data)).toBe(true)
        
        const item = result.data?.[0]
        expect(item).toHaveProperty('product_id', 'subscription_product_123')
        expect(item).toHaveProperty('image', 'https://example.com/subscription.jpg')
        expect(item).toHaveProperty('unit_price', 2000)
        expect(item).toHaveProperty('amount', 2000)
        expect(item).toHaveProperty('quantity', 1)
        expect(item).toHaveProperty('stripe_price_id', 'price_subscription_123')
        expect(item).toHaveProperty('subscription_id', 'sub_test_123')
        expect(item).toHaveProperty('subscription_status', 'active')
        expect(item).toHaveProperty('subscription_interval', '1month')
        expect(item).toHaveProperty('subscription_product', true)
        expect(item).toHaveProperty('title', 'Subscription Product')
    })

    // 作成成功（画像なしの場合）
    it('should create product details successfully for products without images', async () => {
        const stripe = await getMockStripe()
        
        // 画像なし商品のモック
        vi.mocked(stripe.products.retrieve).mockResolvedValue({
            ...mockStripeClient,
            images: [],
        })
    
        const result = await createProductDetails({
            lineItems: mockLineItems,
            subscriptionId: 'sub_test_123',
            isCheckout: true
        })
    
        expect(result.success).toBe(true)
        expect(Array.isArray(result.data)).toBe(true)
        
        const item = result.data?.[0]
        expect(item).toHaveProperty('image', 'https://example.com/assets/products/no-image.png')
    })

    // 作成成功（isCheckout = false）
    it('should create product details successfully when isCheckout is false', async () => {
        const result = await createProductDetails({
            lineItems: mockLineItems,
            subscriptionId: 'sub_test_123',
            isCheckout: false
        })

        expect(result.success).toBe(true)
        expect(Array.isArray(result.data)).toBe(true)
        
        const item = result.data?.[0]
        expect(item).toHaveProperty('amount', mockLineItems[0].price?.unit_amount)
    })

    // 作成失敗（lineItems のデータ無し）
    it('should create product details successfully when lineItems is empty', async () => {
        const stripe = await getMockStripe()
        
        vi.mocked(stripe.products.retrieve).mockResolvedValue({
            ...mockStripeClient
        })

        const result = await createProductDetails({
            lineItems: [],
            subscriptionId: 'sub_test_123',
            isCheckout: true
        })

        expect(result.success).toBe(false)
        expect(result.data).toBeNull()
        expect(result.error).toBe(CHECKOUT_ERROR.NO_LINE_ITEMS)
    })

    // 作成失敗（product のデータ無し）
    it('should create product details successfully when product is not found', async () => {
        const stripe = await getMockStripe()
        
        vi.mocked(stripe.products.retrieve).mockRejectedValue(
            new Error('Stripe API Error')
        )

        const result = await createProductDetails({
            lineItems: mockLineItems,
            subscriptionId: 'sub_test_123',
            isCheckout: true
        })

        expect(result.success).toBe(false)
        expect(result.data).toBeNull()
        expect(result.error).toBe(CHECKOUT_PRODUCT_CREATE_FAILED)
    })
})

/* ==================================== 
    Process Order Data Test
==================================== */
describe('processOrderData', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    const mockSubscriptionMetadata = {
        supabase_id: 'subscription_product_123',
        subscription_product: 'true'
    }

    // 処理成功
    it('should process order data successfully for regular products', async () => {
        const stripe = await getMockStripe()

        const mockGetCheckoutSession = vi.mocked(getCheckoutSession)
        const mockCreateCheckoutOrder = vi.mocked(createCheckoutOrder)
        const mockCreateOrderStripe = vi.mocked(createOrderStripe)
        const mockCreateOrderItems = vi.mocked(createOrderItems)
        const mockCreateOrderItemStripes = vi.mocked(createOrderItemStripes)
        const mockCreateOrderItemSubscriptions = vi.mocked(createOrderItemSubscriptions)

        mockGetCheckoutSession.mockResolvedValue({
            success: true,
            error: null,
            data: {
                ...mockCheckoutSession,
                ...mockSubscriptionLineItems
            }
        })

        vi.mocked(stripe.products.retrieve).mockResolvedValue({
            ...mockStripeClient,
            metadata: mockSubscriptionMetadata
        })

        mockCreateCheckoutOrder.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrder
        })
        
        mockCreateOrderStripe.mockResolvedValue({
            success: true,
            error: null
        })

        mockCreateOrderItems.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrderItems
        })

        mockCreateOrderItemStripes.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrderItemStripes
        })

        mockCreateOrderItemSubscriptions.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrderItemSubscriptions
        })

        const result = await processOrderData({
            checkoutSessionEvent: mockCheckoutSession
        })

        expect(result).toBeDefined()
        expect(result).toHaveProperty('orderData')
        expect(result).toHaveProperty('productDetailsData')
        expect(result.orderData).toHaveProperty('order')
        expect(result.orderData).toHaveProperty('orderShipping')
        expect(result.orderData).toBeDefined()
        expect(result.productDetailsData).toBeDefined()
    })

    // 処理失敗(注文データの取得と保存の失敗)
    it('should return error when retrieveCheckoutSession fails', async () => {
        const mockGetCheckoutSession = vi.mocked(getCheckoutSession)

        mockGetCheckoutSession.mockResolvedValue({
            success: false,
            error: CHECKOUT_ERROR.SESSION_RETRIEVAL_FAILED,
            data: null
        })

        await expect(processOrderData({
            checkoutSessionEvent: mockCheckoutSession
        })).rejects.toThrow(CHECKOUT_ERROR.SESSION_RETRIEVAL_FAILED)
    })

    // 処理失敗(商品詳細データの作成の失敗)
    it('should process order data successfully for subscription products', async () => {
        const stripe = await getMockStripe()

        const mockGetCheckoutSession = vi.mocked(getCheckoutSession)

        mockGetCheckoutSession.mockResolvedValue({
            success: true,
            error: null,
            data: {
                ...mockCheckoutSession,
                ...mockSubscriptionLineItems
            }
        })

        vi.mocked(stripe.products.retrieve).mockRejectedValue(
            new Error('Stripe API Error')
        )

        await expect(processOrderData({
            checkoutSessionEvent: mockCheckoutSession
        })).rejects.toThrow(CHECKOUT_PRODUCT_CREATE_FAILED)
    })

    // 処理失敗(Order テーブルのデータ作成の失敗)
    it('should return error when createOrderStripe fails', async () => {
        const stripe = await getMockStripe()

        const mockGetCheckoutSession = vi.mocked(getCheckoutSession)
        const mockCreateCheckoutOrder = vi.mocked(createCheckoutOrder)

        mockGetCheckoutSession.mockResolvedValue({
            success: true,
            error: null,
            data: {
                ...mockCheckoutSession,
                ...mockSubscriptionLineItems
            }
        })

        vi.mocked(stripe.products.retrieve).mockResolvedValue({
            ...mockStripeClient
        })

        mockCreateCheckoutOrder.mockResolvedValue({
            success: false,
            error: CREATE_ORDER_FAILED,
            data: null
        })
        
        await expect(processOrderData({
            checkoutSessionEvent: mockCheckoutSession
        })).rejects.toThrow(CREATE_ORDER_FAILED)
    })

    // 処理失敗(OrderStripe テーブルのデータ作成の失敗)
    it('should process order data successfully for regular products', async () => {
        const stripe = await getMockStripe()

        const mockGetCheckoutSession = vi.mocked(getCheckoutSession)
        const mockCreateCheckoutOrder = vi.mocked(createCheckoutOrder)
        const mockCreateOrderStripe = vi.mocked(createOrderStripe)
        const mockDeleteOrder = vi.mocked(deleteOrder)

        mockGetCheckoutSession.mockResolvedValue({
            success: true,
            error: null,
            data: {
                ...mockCheckoutSession,
                ...mockSubscriptionLineItems
            }
        })

        vi.mocked(stripe.products.retrieve).mockResolvedValue({
            ...mockStripeClient
        })

        mockCreateCheckoutOrder.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrder
        })
        
        mockCreateOrderStripe.mockResolvedValue({
            success: false,
            error: ORDER_STRIPE_ERROR.CREATE_FAILED
        })

        await expect(processOrderData({
            checkoutSessionEvent: mockCheckoutSession
        })).rejects.toThrow(ORDER_STRIPE_ERROR.CREATE_FAILED)
        expect(mockDeleteOrder).toHaveBeenCalledWith({ orderId: mockOrder.order.id })
    })
    
    // 処理失敗(OrderItems テーブルのデータ作成の失敗)
    it('should return error when createOrderItems fails', async () => {
        const stripe = await getMockStripe()

        const mockGetCheckoutSession = vi.mocked(getCheckoutSession)
        const mockCreateCheckoutOrder = vi.mocked(createCheckoutOrder)
        const mockCreateOrderStripe = vi.mocked(createOrderStripe)
        const mockCreateOrderItems = vi.mocked(createOrderItems)
        const mockDeleteOrder = vi.mocked(deleteOrder)
        const mockDeleteOrderStripe = vi.mocked(deleteOrderStripe)

        mockGetCheckoutSession.mockResolvedValue({
            success: true,
            error: null,
            data: {
                ...mockCheckoutSession,
                ...mockSubscriptionLineItems
            }
        })

        vi.mocked(stripe.products.retrieve).mockResolvedValue({
            ...mockStripeClient
        })

        mockCreateCheckoutOrder.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrder
        })
        
        mockCreateOrderStripe.mockResolvedValue({
            success: true,
            error: null
        })

        mockCreateOrderItems.mockResolvedValue({
            success: false,
            error: ORDER_ITEM_ERROR.CREATE_FAILED,
            data: null
        })

        await expect(processOrderData({
            checkoutSessionEvent: mockCheckoutSession
        })).rejects.toThrow(ORDER_ITEM_ERROR.CREATE_FAILED)
        expect(mockDeleteOrder).toHaveBeenCalledWith({ orderId: mockOrder.order.id })
        expect(mockDeleteOrderStripe).toHaveBeenCalledWith({ orderId: mockOrder.order.id })
    })

    // 処理失敗(OrderItemStripes テーブルのデータ作成の失敗)
    it('should return error when createOrderItemStripes fails', async () => {
        const stripe = await getMockStripe()

        const mockGetCheckoutSession = vi.mocked(getCheckoutSession)
        const mockCreateCheckoutOrder = vi.mocked(createCheckoutOrder)
        const mockCreateOrderStripe = vi.mocked(createOrderStripe)
        const mockCreateOrderItems = vi.mocked(createOrderItems)
        const mockCreateOrderItemStripes = vi.mocked(createOrderItemStripes)
        const mockDeleteOrder = vi.mocked(deleteOrder)
        const mockDeleteOrderStripe = vi.mocked(deleteOrderStripe)
        const mockDeleteAllOrderItem = vi.mocked(deleteAllOrderItem)

        mockGetCheckoutSession.mockResolvedValue({
            success: true,
            error: null,
            data: {
                ...mockCheckoutSession,
                ...mockSubscriptionLineItems
            }
        })

        vi.mocked(stripe.products.retrieve).mockResolvedValue({
            ...mockStripeClient
        })

        mockCreateCheckoutOrder.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrder
        })
        
        mockCreateOrderStripe.mockResolvedValue({
            success: true,
            error: null
        })

        mockCreateOrderItems.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrderItems
        })

        mockCreateOrderItemStripes.mockResolvedValue({
            success: false,
            error: ORDER_ITEM_STRIPE_ERROR.CREATE_FAILED,
            data: null
        })

        await expect(processOrderData({
            checkoutSessionEvent: mockCheckoutSession
        })).rejects.toThrow(ORDER_ITEM_STRIPE_ERROR.CREATE_FAILED)
        expect(mockDeleteOrder).toHaveBeenCalledWith({ orderId: mockOrder.order.id })
        expect(mockDeleteOrderStripe).toHaveBeenCalledWith({ orderId: mockOrder.order.id })
        expect(mockDeleteAllOrderItem).toHaveBeenCalledWith({ orderId: mockOrder.order.id })
    })

    // 処理失敗(OrderItemSubscriptions テーブルのデータ作成の失敗)
    it('should return error when createOrderItemSubscriptions fails', async () => {
        const stripe = await getMockStripe()

        const mockGetCheckoutSession = vi.mocked(getCheckoutSession)
        const mockCreateCheckoutOrder = vi.mocked(createCheckoutOrder)
        const mockCreateOrderStripe = vi.mocked(createOrderStripe)
        const mockCreateOrderItems = vi.mocked(createOrderItems)
        const mockCreateOrderItemStripes = vi.mocked(createOrderItemStripes)
        const mockCreateOrderItemSubscriptions = vi.mocked(createOrderItemSubscriptions)
        const mockDeleteOrder = vi.mocked(deleteOrder)
        const mockDeleteOrderStripe = vi.mocked(deleteOrderStripe)
        const mockDeleteAllOrderItem = vi.mocked(deleteAllOrderItem)
        const mockDeleteOrderItemStripes = vi.mocked(deleteOrderItemStripes)

        mockGetCheckoutSession.mockResolvedValue({
            success: true,
            error: null,
            data: {
                ...mockCheckoutSession,
                ...mockSubscriptionLineItems
            }
        })

        vi.mocked(stripe.products.retrieve).mockResolvedValue({
            ...mockStripeClient,
            metadata: mockSubscriptionMetadata
        })

        mockCreateCheckoutOrder.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrder
        })
        
        mockCreateOrderStripe.mockResolvedValue({
            success: true,
            error: null
        })

        mockCreateOrderItems.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrderItems
        })

        mockCreateOrderItemStripes.mockResolvedValue({
            success: true,
            error: null,
            data: mockOrderItemStripes
        })

        mockCreateOrderItemSubscriptions.mockResolvedValue({
            success: false,
            error: SUBSCRIPTION_ERROR.CREATE_FAILED,
            data: null
        })

        await expect(processOrderData({
            checkoutSessionEvent: mockCheckoutSession
        })).rejects.toThrow(SUBSCRIPTION_ERROR.CREATE_FAILED)
        expect(mockDeleteOrder).toHaveBeenCalledWith({ orderId: mockOrder.order.id })
        expect(mockDeleteOrderStripe).toHaveBeenCalledWith({ orderId: mockOrder.order.id })
        expect(mockDeleteAllOrderItem).toHaveBeenCalledWith({ orderId: mockOrder.order.id })
        expect(mockDeleteOrderItemStripes).toHaveBeenCalledWith({ orderItemId: mockOrderItems[0].id })
    })
})

/* ==================================== 
    Process Shipping Address Test
==================================== */
describe('processShippingAddress', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    const mockCheckoutSessionWithCustomer = {
        ...mockCheckoutSession,
        customer: 'cus_test_123',
        customer_details: {
            name: 'Test User',
            address: {
                line1: 'Test Address',
                line2: 'Test City',
                city: 'Test City',
                state: 'Test State',
                postal_code: '123-4567'
            }
        }
    }

    // 処理成功(デフォルト住所有りの場合)
    it('should process shipping address successfully when default shipping address exists', async () => {
        const mockGetDefaultShippingAddress = vi.mocked(getDefaultShippingAddress)

        mockGetDefaultShippingAddress.mockResolvedValue({
            data: mockShippingAddress
        })

        await processShippingAddress({
            checkoutSessionEvent: mockCheckoutSessionWithCustomer as unknown as StripeCheckoutSession,
            userId: 'user_test_123'
        })

        expect(createShippingAddress).not.toHaveBeenCalled()
        expect(updateCustomerShippingAddress).not.toHaveBeenCalled()
    })

    // 処理成功(デフォルト住所無しの場合)
    it('should process shipping address successfully when default shipping address does not exist', async () => {
        const mockGetDefaultShippingAddress = vi.mocked(getDefaultShippingAddress)
        const mockCreateShippingAddress = vi.mocked(createShippingAddress)
        const mockUpdateCustomerShippingAddress = vi.mocked(updateCustomerShippingAddress)

        mockGetDefaultShippingAddress.mockResolvedValue({
            data: mockShippingAddress
        })

        mockCreateShippingAddress.mockResolvedValue({
            success: true,
            data: mockShippingAddress
        })

        mockUpdateCustomerShippingAddress.mockResolvedValue({
            success: true,
            error: null,
            data: mockCustomer
        })

        const result = await processShippingAddress({
            checkoutSessionEvent: mockCheckoutSessionWithCustomer as unknown as StripeCheckoutSession,
            userId: 'user_test_123'
        })

        expect(result).toBeUndefined()
    })

    // 処理失敗(ユーザーID無し)
    it('should return error when userId is null', async () => {
        await expect(processShippingAddress({
            checkoutSessionEvent: mockCheckoutSession,
            userId: null as unknown as UserId
        })).rejects.toThrow(SHIPPING_ADDRESS_ERROR.NO_USER_ID)
    })

    // 処理失敗(デフォルト住所の取得失敗)
    it('should return error when getDefaultShippingAddress fails', async () => {
        const mockGetDefaultShippingAddress = vi.mocked(getDefaultShippingAddress)

        mockGetDefaultShippingAddress.mockResolvedValue({
            data: null
        })

        const result = await processShippingAddress({
            checkoutSessionEvent: mockCheckoutSession,
            userId: 'user_test_123'
        })

        expect(result).toBeUndefined()
    })

    // 処理失敗(デフォルト住所の作成失敗)
    it('should return error when createShippingAddress fails', async () => {
        const mockGetDefaultShippingAddress = vi.mocked(getDefaultShippingAddress)
        const mockCreateShippingAddress = vi.mocked(createShippingAddress)
        const mockUpdateCustomerShippingAddress = vi.mocked(updateCustomerShippingAddress)
    
        mockGetDefaultShippingAddress.mockResolvedValue({
            data: null
        })
    
        mockCreateShippingAddress.mockResolvedValue({
            success: false,
            data: null as unknown as ShippingAddress
        })
    
        await expect(processShippingAddress({
            checkoutSessionEvent: mockCheckoutSessionWithCustomer as unknown as StripeCheckoutSession,
            userId: 'user_test_123'
        })).rejects.toThrow(SHIPPING_ADDRESS_ERROR.CREATE_FAILED)
    
        expect(mockUpdateCustomerShippingAddress).not.toHaveBeenCalled()
    })

    // 処理失敗(デフォルト住所の更新失敗)
    it('should return error when updateCustomerShippingAddress fails', async () => {
        const mockGetDefaultShippingAddress = vi.mocked(getDefaultShippingAddress)
        const mockCreateShippingAddress = vi.mocked(createShippingAddress)
        const mockUpdateCustomerShippingAddress = vi.mocked(updateCustomerShippingAddress)

        mockGetDefaultShippingAddress.mockResolvedValue({
            data: null
        })

        mockCreateShippingAddress.mockResolvedValue({
            success: true,
            data: mockShippingAddress
        })

        mockUpdateCustomerShippingAddress.mockResolvedValue({
            success: false,
            error: SHIPPING_ADDRESS_ERROR.SET_DEFAULT_FAILED,
            data: null
        })

        await expect(processShippingAddress({
            checkoutSessionEvent: mockCheckoutSessionWithCustomer as unknown as StripeCheckoutSession,
            userId: 'user_test_123'
        })).rejects.toThrow(SHIPPING_ADDRESS_ERROR.SET_DEFAULT_FAILED)
    })

    // 処理失敗(customerDetails 無し)
    it('should not create shipping address when customerDetails is null', async () => {
        const mockGetDefaultShippingAddress = vi.mocked(getDefaultShippingAddress)
        
        mockGetDefaultShippingAddress.mockResolvedValue({
            data: null
        })
    
        const checkoutSessionWithoutCustomerDetails = {
            ...mockCheckoutSessionWithCustomer,
            customer_details: null
        }
    
        const result = await processShippingAddress({
            checkoutSessionEvent: checkoutSessionWithoutCustomerDetails as unknown as StripeCheckoutSession,
            userId: 'user_test_123'
        })
    
        expect(createShippingAddress).not.toHaveBeenCalled()
        expect(updateCustomerShippingAddress).not.toHaveBeenCalled()
        expect(result).toBeUndefined()
    })

    // 処理失敗(customerId 無し)
    it('should not create shipping address when customerId is null', async () => {
        const mockGetDefaultShippingAddress = vi.mocked(getDefaultShippingAddress)
        
        mockGetDefaultShippingAddress.mockResolvedValue({
            data: null
        })
    
        const checkoutSessionWithoutCustomer = {
            ...mockCheckoutSessionWithCustomer,
            customer: null
        }
    
        const result = await processShippingAddress({
            checkoutSessionEvent: checkoutSessionWithoutCustomer as unknown as StripeCheckoutSession,
            userId: 'user_test_123'
        })
    
        expect(createShippingAddress).not.toHaveBeenCalled()
        expect(updateCustomerShippingAddress).not.toHaveBeenCalled()
        expect(result).toBeUndefined()
    })

    // 処理失敗(address 無し)
    it('should handle missing address in customerDetails', async () => {
        const mockGetDefaultShippingAddress = vi.mocked(getDefaultShippingAddress)
        const mockCreateShippingAddress = vi.mocked(createShippingAddress)
        const mockUpdateCustomerShippingAddress = vi.mocked(updateCustomerShippingAddress)
        
        mockGetDefaultShippingAddress.mockResolvedValue({
            data: null
        })
    
        const checkoutSessionWithoutAddress = {
            ...mockCheckoutSessionWithCustomer,
            customer_details: {
                name: 'Test User',
                address: null
            }
        }
    
        mockCreateShippingAddress.mockResolvedValue({
            success: true,
            data: mockShippingAddress
        })
    
        mockUpdateCustomerShippingAddress.mockResolvedValue({
            success: true,
            error: null,
            data: mockCustomer
        })
    
        await processShippingAddress({
            checkoutSessionEvent: checkoutSessionWithoutAddress as unknown as StripeCheckoutSession,
            userId: 'user_test_123'
        })
    
        expect(createShippingAddress).toHaveBeenCalledWith({
            address: expect.objectContaining({
                name: 'Test User',
                postal_code: undefined,
                state: undefined,
                city: '',
                address_line1: undefined,
                address_line2: '',
                is_default: true
            })
        })
    })
})

/* ==================================== 
    Send Order Emails Test
==================================== */
describe('sendOrderEmails', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })
    
    // 送信成功（payment_intentが文字列の場合）
    it('should send order emails successfully when payment_intent is a string', async () => {
        const stripe = await getMockStripe()

        const mockSendPaymentRequestEmail = vi.mocked(sendPaymentRequestEmail)

        const checkoutSessionWithPaymentIntent = {
            ...mockCheckoutSession,
            payment_intent: 'pi_test_123'
        }

        vi.mocked(stripe.paymentIntents.retrieve).mockResolvedValue({
            ...mockPaymentIntent,
            last_payment_error: null
        })

        mockSendPaymentRequestEmail.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await sendOrderEmails({
            orderData: mockOrder,
            productDetails: mockSubscriptionProductDetails,
            checkoutSessionEvent: checkoutSessionWithPaymentIntent
        })

        expect(stripe.paymentIntents.retrieve).toHaveBeenCalledWith('pi_test_123')
        expect(mockSendPaymentRequestEmail).toHaveBeenCalledWith({
            orderData: checkoutSessionWithPaymentIntent,
            productDetails: mockSubscriptionProductDetails,
            orderNumber: mockOrder.order.order_number,
            paymentIntent: expect.objectContaining({
                id: 'pi_test_123'
            }),
            checkoutSessionEvent: checkoutSessionWithPaymentIntent
        })

        expect(result).toBeUndefined()
    })

    // 送信成功（payment_intent が null）
    it('should send order emails successfully when payment_intent is null', async () => {
        const mockSendPaymentRequestEmail = vi.mocked(sendPaymentRequestEmail)

        mockSendPaymentRequestEmail.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await sendOrderEmails({
            orderData: mockOrder,
            productDetails: mockSubscriptionProductDetails,
            checkoutSessionEvent: mockCheckoutSession
        })

        expect(mockSendPaymentRequestEmail).toHaveBeenCalledWith({
            orderData: mockCheckoutSession,
            productDetails: mockSubscriptionProductDetails,
            orderNumber: mockOrder.order.order_number,
            paymentIntent: null,
            checkoutSessionEvent: mockCheckoutSession
        })

        expect(result).toBeUndefined()
    })

    // 送信失敗
    it('should throw error when sendPaymentRequestEmail fails', async () => {
        const mockSendPaymentRequestEmail = vi.mocked(sendPaymentRequestEmail)

        mockSendPaymentRequestEmail.mockResolvedValue({
            success: false,
            error: PAYMENT_REQUEST_SEND_FAILED
        })

        await expect(sendOrderEmails({
            orderData: mockOrder,
            productDetails: mockSubscriptionProductDetails,
            checkoutSessionEvent: mockCheckoutSession
        })).rejects.toThrow(PAYMENT_REQUEST_SEND_FAILED)
    })
    
    // 送信失敗（例外発生）
    it('should handle stripe paymentIntents retrieve error', async () => {
        const stripe = await getMockStripe()

        const checkoutSessionWithPaymentIntent = {
            ...mockCheckoutSession,
            payment_intent: 'pi_test_123'
        }

        vi.mocked(stripe.paymentIntents.retrieve).mockRejectedValue(
            new Error('Stripe API Error')
        )

        await expect(sendOrderEmails({
            orderData: mockOrder,
            productDetails: mockSubscriptionProductDetails,
            checkoutSessionEvent: checkoutSessionWithPaymentIntent
        })).rejects.toThrow('Stripe API Error')
    })
})

/* ==================================== 
    Handle Subscription Event Test
==================================== */
describe('handleSubscriptionEvent', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    const mockSubscriptionProductDetails = {
        ...mockStripeClient,
        id: 'prod_subscription_123',
        description: 'Subscription Product',
        images: ['https://example.com/subscription.jpg'],
        metadata: {
            supabase_id: 'subscription_product_123',
            subscription_product: 'true'
        },
        name: 'Subscription Product'
    }
    
    // 処理成功(ステータスが active)
    it('should handle subscription event successfully for active status', async () => {
        const stripe = await getMockStripe()
        const mockCreateSubscriptionPayment = vi.mocked(createSubscriptionPayment)
        const mockFormatStripeSubscriptionStatus = vi.mocked(formatStripeSubscriptionStatus)

        const mockSubscriptionEvent = {
            ...mockSubscription,
            status: 'active',
            metadata: {
                userID: 'user_test_123'
            }
        }

        mockFormatStripeSubscriptionStatus.mockReturnValue('succeeded')
        mockCreateSubscriptionPayment.mockResolvedValue({
            success: true,
            data: { 
                ...mockSubscriptionPayment,
                status: 'succeeded', 
            }
        })

        const result = await handleSubscriptionEvent({
            subscriptionEvent: mockSubscriptionEvent as unknown as StripeSubscription
        })

        expect(mockFormatStripeSubscriptionStatus).toHaveBeenCalledWith('active')
        expect(mockCreateSubscriptionPayment).toHaveBeenCalledWith({
            subscriptionPaymentData: expect.objectContaining({
                user_id: 'user_test_123',
                subscription_id: mockSubscriptionEvent.id,
                status: 'succeeded'
            })
        })
        expect(stripe.subscriptions.retrieve).not.toHaveBeenCalled()
        expect(result).toBeUndefined()
    })

    // 処理成功(ステータスが 非active)
    it('should handle subscription event successfully for non-active status', async () => {
        const stripe = await getMockStripe()

        const mockCreateSubscriptionPayment = vi.mocked(createSubscriptionPayment)
        const mockFormatStripeSubscriptionStatus = vi.mocked(formatStripeSubscriptionStatus)
        const mockSendSubscriptionPaymentRequestEmail = vi.mocked(sendSubscriptionPaymentRequestEmail)

        const mockSubscriptionEvent = {
            ...mockSubscription,
            status: 'past_due',
            metadata: {
                userID: 'user_test_123'
            }
        }

        mockFormatStripeSubscriptionStatus.mockReturnValue('failed')
        mockCreateSubscriptionPayment.mockResolvedValue({
            success: true,
            data: { 
                ...mockSubscriptionPayment,
                status: 'failed', 
            }
        })

        vi.mocked(stripe.subscriptions.retrieve).mockResolvedValue({
            ...mockSubscription,
            items: {
                object: 'list' as const,
                data: mockSubscriptionItems,
                has_more: false,
                url: '/v1/subscriptions/sub_test_123/items'
            }
        })

        vi.mocked(stripe.products.retrieve).mockResolvedValue({
            ...mockSubscriptionProductDetails
        })

        mockSendSubscriptionPaymentRequestEmail.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await handleSubscriptionEvent({
            subscriptionEvent: mockSubscriptionEvent as unknown as StripeSubscription
        })

        expect(stripe.subscriptions.retrieve).toHaveBeenCalledWith(mockSubscriptionEvent.id)
        expect(mockSendSubscriptionPaymentRequestEmail).toHaveBeenCalledWith({
            orderData: mockSubscriptionEvent,
            productDetails: expect.arrayContaining([
                expect.objectContaining({
                    product_id: 'subscription_product_123',
                    image: 'https://example.com/subscription.jpg',
                    title: 'Subscription Product',
                    unit_price: 2000,
                    amount: 2000,
                    quantity: 1,
                    stripe_price_id: 'price_subscription_123',
                    subscription_id: 'sub_test_123',
                    subscription_status: 'active',
                    subscription_interval: '1month',
                    subscription_product: true
                })
            ])
        })
        expect(result).toBeUndefined()
    })

    // 処理失敗(サブスクリプションの支払いデータの作成失敗)
    it('should throw error when createSubscriptionPayment fails', async () => {
        const mockCreateSubscriptionPayment = vi.mocked(createSubscriptionPayment)
        const mockFormatStripeSubscriptionStatus = vi.mocked(formatStripeSubscriptionStatus)

        const mockSubscriptionEvent = {
            ...mockSubscription,
            status: 'active',
            metadata: {
                userID: 'user_test_123'
            }
        }

        mockFormatStripeSubscriptionStatus.mockReturnValue('succeeded')
        mockCreateSubscriptionPayment.mockResolvedValue({
            success: false,
            data: null as unknown as SubscriptionPayment
        })

        await expect(handleSubscriptionEvent({
            subscriptionEvent: mockSubscriptionEvent as unknown as StripeSubscription
        })).rejects.toThrow(SUBSCRIPTION_PAYMENT_ERROR.CREATE_FAILED)
    })

    // 処理失敗(未払い通知メールの送信失敗)
    it('should throw error when sendSubscriptionPaymentRequestEmail fails', async () => {
        const stripe = await getMockStripe()

        const mockCreateSubscriptionPayment = vi.mocked(createSubscriptionPayment)
        const mockFormatStripeSubscriptionStatus = vi.mocked(formatStripeSubscriptionStatus)
        const mockSendSubscriptionPaymentRequestEmail = vi.mocked(sendSubscriptionPaymentRequestEmail)

        const mockSubscriptionEvent = {
            ...mockSubscription,
            status: 'past_due',
            metadata: {
                userID: 'user_test_123'
            }
        }

        mockFormatStripeSubscriptionStatus.mockReturnValue('failed')
        mockCreateSubscriptionPayment.mockResolvedValue({
            success: true,
            data: { 
                ...mockSubscriptionPayment,
                status: 'failed', 
            }
        })

        vi.mocked(stripe.subscriptions.retrieve).mockResolvedValue({
            ...mockSubscription,
            items: {
                object: 'list' as const,
                data: mockSubscriptionItems,
                has_more: false,
                url: '/v1/subscriptions/sub_test_123/items'
            }
        })

        vi.mocked(stripe.products.retrieve).mockResolvedValue({
            ...mockSubscriptionProductDetails
        })

        mockSendSubscriptionPaymentRequestEmail.mockResolvedValue({
            success: false,
            error: SUBSCRIPTION_PAYMENT_REQUEST_SEND_FAILED
        })

        await expect(handleSubscriptionEvent({
            subscriptionEvent: mockSubscriptionEvent as unknown as StripeSubscription
        })).rejects.toThrow(SUBSCRIPTION_PAYMENT_REQUEST_SEND_FAILED)
    })

    // 処理失敗(例外発生)
    it('should handle stripe subscriptions retrieve error', async () => {
        const stripe = await getMockStripe()

        const mockCreateSubscriptionPayment = vi.mocked(createSubscriptionPayment)
        const mockFormatStripeSubscriptionStatus = vi.mocked(formatStripeSubscriptionStatus)

        const mockSubscriptionEvent = {
            ...mockSubscription,
            status: 'past_due',
            metadata: {
                userID: 'user_test_123'
            }
        }

        mockFormatStripeSubscriptionStatus.mockReturnValue('failed')
        mockCreateSubscriptionPayment.mockResolvedValue({
            success: true,
            data: { 
                ...mockSubscriptionPayment,
                status: 'failed', 
            }
        })

        vi.mocked(stripe.subscriptions.retrieve).mockRejectedValue(
            new Error('Stripe API Error')
        )

        await expect(handleSubscriptionEvent({
            subscriptionEvent: mockSubscriptionEvent as unknown as StripeSubscription
        })).rejects.toThrow('Stripe API Error')
    })
})

/* ==================================== 
    Handle Subscription Update Test
==================================== */
describe('handleSubscriptionUpdate', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    // 更新成功（previousAttributes が null & currentStatus が active）
    it('should return early when previousAttributes is null and currentStatus is active', async () => {
        const mockUpdateSubscriptionPaymentStatus = vi.mocked(updateSubscriptionPaymentStatus)
        
        const mockSubscriptionEvent = {
            ...mockSubscription,
            status: 'active'
        }

        const result = await handleSubscriptionUpdate({
            subscriptionEvent: mockSubscriptionEvent as unknown as StripeSubscription,
            previousAttributes: null
        })

        expect(mockUpdateSubscriptionPaymentStatus).not.toHaveBeenCalled()
        expect(result).toBeUndefined()
    })

    // 更新成功（previousStatus と currentStatus が異なる場合）
    it('should update subscription payment status when status changes', async () => {
        const mockUpdateSubscriptionPaymentStatus = vi.mocked(updateSubscriptionPaymentStatus)
        const mockFormatStripeSubscriptionStatus = vi.mocked(formatStripeSubscriptionStatus)

        const mockSubscriptionEvent = {
            ...mockSubscription,
            status: 'past_due'
        }

        const mockPreviousAttributes = {
            status: 'active'
        }

        mockFormatStripeSubscriptionStatus.mockReturnValue('failed')
        mockUpdateSubscriptionPaymentStatus.mockResolvedValue({
            success: true,
            data: { 
                ...mockSubscriptionPayment,
                status: 'failed'
            },
            error: null
        })

        const result = await handleSubscriptionUpdate({
            subscriptionEvent: mockSubscriptionEvent as unknown as StripeSubscription,
            previousAttributes: mockPreviousAttributes as unknown as Partial<StripeSubscription>
        })

        expect(mockFormatStripeSubscriptionStatus).toHaveBeenCalledWith('past_due')
        expect(mockUpdateSubscriptionPaymentStatus).toHaveBeenCalledWith({
            subscriptionId: mockSubscriptionEvent.id,
            status: 'failed'
        })
        expect(result).toBeUndefined()
    })

    // 更新成功（previousStatus と currentStatus が同じ場合）
    it('should not update when previousStatus and currentStatus are the same', async () => {
        const mockUpdateSubscriptionPaymentStatus = vi.mocked(updateSubscriptionPaymentStatus)

        const mockSubscriptionEvent = {
            ...mockSubscription,
            status: 'active'
        }

        const mockPreviousAttributes = {
            status: 'active'
        }

        const result = await handleSubscriptionUpdate({
            subscriptionEvent: mockSubscriptionEvent as unknown as StripeSubscription,
            previousAttributes: mockPreviousAttributes as unknown as Partial<StripeSubscription>
        })

        expect(mockUpdateSubscriptionPaymentStatus).not.toHaveBeenCalled()
        expect(result).toBeUndefined()
    })

    // 更新成功（previousStatus が undefined の場合）
    it('should not update when previousStatus is undefined', async () => {
        const mockUpdateSubscriptionPaymentStatus = vi.mocked(updateSubscriptionPaymentStatus)

        const mockSubscriptionEvent = {
            ...mockSubscription,
            status: 'past_due'
        }

        const mockPreviousAttributes = {}

        const result = await handleSubscriptionUpdate({
            subscriptionEvent: mockSubscriptionEvent as unknown as StripeSubscription,
            previousAttributes: mockPreviousAttributes
        })

        expect(mockUpdateSubscriptionPaymentStatus).not.toHaveBeenCalled()
        expect(result).toBeUndefined()
    })

    // 更新成功（currentStatus が undefined の場合）
    it('should not update when currentStatus is undefined', async () => {
        const mockUpdateSubscriptionPaymentStatus = vi.mocked(updateSubscriptionPaymentStatus)

        const mockSubscriptionEvent = {
            ...mockSubscription,
        }

        const mockPreviousAttributes = {
            status: 'active'
        }

        const result = await handleSubscriptionUpdate({
            subscriptionEvent: mockSubscriptionEvent as unknown as StripeSubscription,
            previousAttributes: mockPreviousAttributes as unknown as Partial<StripeSubscription>
        })

        expect(mockUpdateSubscriptionPaymentStatus).not.toHaveBeenCalled()
        expect(result).toBeUndefined()
    })

    // 更新失敗
    it('should throw error when updateSubscriptionPaymentStatus fails', async () => {
        const mockUpdateSubscriptionPaymentStatus = vi.mocked(updateSubscriptionPaymentStatus)
        const mockFormatStripeSubscriptionStatus = vi.mocked(formatStripeSubscriptionStatus)

        const mockSubscriptionEvent = {
            ...mockSubscription,
            status: 'past_due'
        }

        const mockPreviousAttributes = {
            status: 'active'
        }

        mockFormatStripeSubscriptionStatus.mockReturnValue('failed')
        mockUpdateSubscriptionPaymentStatus.mockResolvedValue({
            success: false,
            data: null,
            error: SUBSCRIPTION_PAYMENT_ERROR.UPDATE_FAILED
        })

        await expect(handleSubscriptionUpdate({
            subscriptionEvent: mockSubscriptionEvent as unknown as StripeSubscription,
            previousAttributes: mockPreviousAttributes as unknown as Partial<StripeSubscription>
        })).rejects.toThrow(SUBSCRIPTION_PAYMENT_ERROR.UPDATE_FAILED)
    })

    // 更新失敗(例外発生)
    it('should handle updateSubscriptionPaymentStatus exception', async () => {
        const mockUpdateSubscriptionPaymentStatus = vi.mocked(updateSubscriptionPaymentStatus)
        const mockFormatStripeSubscriptionStatus = vi.mocked(formatStripeSubscriptionStatus)

        const mockSubscriptionEvent = {
            ...mockSubscription,
            status: 'past_due'
        }

        const mockPreviousAttributes = {
            status: 'active'
        }

        mockFormatStripeSubscriptionStatus.mockReturnValue('failed')
        mockUpdateSubscriptionPaymentStatus.mockRejectedValue(
            new Error('Database error')
        )

        await expect(handleSubscriptionUpdate({
            subscriptionEvent: mockSubscriptionEvent as unknown as StripeSubscription,
            previousAttributes: mockPreviousAttributes as unknown as Partial<StripeSubscription>
        })).rejects.toThrow('Database error')
    })
})

/* ==================================== 
    Create Stripe Product Data Test
==================================== */
describe('createStripeProductData', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    const mockProductData = {
        ...mockStripeClient, 
        id: 'prod_test_123',
        name: 'Test Product',
        metadata: {
            supabase_id: 'product_test_123'
        }
    }

    // 作成成功（通常商品の場合）
    it('should create stripe product data successfully for regular product', async () => {
        const mockCreateStripeProduct = vi.mocked(createStripeProduct)
        const mockCreateStripePrice = vi.mocked(createStripePrice)
        const mockCreateSubscriptionPrices = vi.mocked(createSubscriptionPrices)

        mockCreateStripeProduct.mockResolvedValue({
            success: true,
            data: mockProductData,
            error: null
        })

        mockCreateStripePrice.mockResolvedValue({
            success: true,
            data: mockPrice,
            error: null
        })

        mockCreateSubscriptionPrices.mockResolvedValue(null)

        const result = await createStripeProductData({
            ...mockStripeProduct
        })

        expect(mockCreateStripeProduct).toHaveBeenCalledWith({
            name: 'Test Product',
            metadata: {
                supabase_id: 'product_test_123'
            }
        })

        expect(mockCreateStripePrice).toHaveBeenCalledWith({
            product: 'prod_test_123',
            unit_amount: 1000,
            currency: 'jpy'
        })

        expect(mockCreateSubscriptionPrices).toHaveBeenCalledWith({
            productData: mockProductData,
            subscriptionPriceIds: null
        })

        expect(result).toEqual({
            productData: mockProductData,
            priceData: mockPrice,
            stripeSalePriceId: null,
            updatedSubscriptionPriceIds: null
        })
    })

    // 作成成功（セール価格の場合）
    it('should create stripe product data successfully with sale price', async () => {
        const mockCreateStripeProduct = vi.mocked(createStripeProduct)
        const mockCreateStripePrice = vi.mocked(createStripePrice)
        const mockCreateSubscriptionPrices = vi.mocked(createSubscriptionPrices)

        mockCreateStripeProduct.mockResolvedValue({
            success: true,
            data: mockProductData,
            error: null
        })

        mockCreateStripePrice
            .mockResolvedValueOnce({
                success: true,
                data: mockPrice,
                error: null
            })
            .mockResolvedValueOnce({
                success: true,
                data: mockPrice,
                error: null
            })

        mockCreateSubscriptionPrices.mockResolvedValue(null)

        const result = await createStripeProductData({
            ...mockStripeProduct,
            salePrice: 800
        })

        expect(mockCreateStripePrice).toHaveBeenCalledTimes(2)
        expect(mockCreateStripePrice).toHaveBeenNthCalledWith(1, {
            product: 'prod_test_123',
            unit_amount: 1000,
            currency: 'jpy',
            nickname: '通常価格'
        })
        expect(mockCreateStripePrice).toHaveBeenNthCalledWith(2, {
            product: 'prod_test_123',
            unit_amount: 800,
            currency: 'jpy',
            nickname: 'セール価格'
        })

        expect(result).toEqual({
            productData: mockProductData,
            priceData: mockPrice,
            stripeSalePriceId: mockPrice.id, 
            updatedSubscriptionPriceIds: null
        })
    })

    // 作成成功（サブスクリプション価格の場合）
    it('should create stripe product data successfully for subscription product', async () => {
        const mockCreateStripeProduct = vi.mocked(createStripeProduct)
        const mockCreateStripePrice = vi.mocked(createStripePrice)
        const mockCreateSubscriptionPrices = vi.mocked(createSubscriptionPrices)

        const mockSubscriptionPriceIds = 'month_1000\nyear_10000'

        mockCreateStripeProduct.mockResolvedValue({
            success: true,
            data: mockProductData,
            error: null
        })

        mockCreateStripePrice.mockResolvedValue({
            success: true,
            data: mockPrice,
            error: null
        })

        mockCreateSubscriptionPrices.mockResolvedValue(mockSubscriptionPriceIds)

        const result = await createStripeProductData({
            ...mockStripeProduct,
            subscriptionPriceIds: mockSubscriptionPriceIds
        })

        expect(mockCreateStripeProduct).toHaveBeenCalledWith({
            name: 'Test Product',
            metadata: {
                supabase_id: 'product_test_123',
                subscription_product: true
            }
        })

        expect(mockCreateSubscriptionPrices).toHaveBeenCalledWith({
            productData: mockProductData,
            subscriptionPriceIds: mockSubscriptionPriceIds
        })

        expect(result).toEqual({
            productData: mockProductData,
            priceData: mockPrice,
            stripeSalePriceId: null,
            updatedSubscriptionPriceIds: mockSubscriptionPriceIds
        })
    })

    // 作成失敗（Stripe 商品の作成失敗）
    it('should throw error when createStripeProduct fails', async () => {
        const mockCreateStripeProduct = vi.mocked(createStripeProduct)

        mockCreateStripeProduct.mockResolvedValue({
            success: false,
            data: null,
            error: STRIPE_ERROR.PRODUCT_CREATE_FAILED
        })

        await expect(createStripeProductData({
            ...mockStripeProduct
        })).rejects.toThrow(STRIPE_ERROR.PRODUCT_CREATE_FAILED)
    })

    // 作成失敗（Stripe 価格の作成失敗）
    it('should throw error when createStripePrice fails', async () => {
        const mockCreateStripeProduct = vi.mocked(createStripeProduct)
        const mockCreateStripePrice = vi.mocked(createStripePrice)

        mockCreateStripeProduct.mockResolvedValue({
            success: true,
            data: mockProductData,
            error: null
        })

        mockCreateStripePrice.mockResolvedValue({
            success: false,
            data: null,
            error: PRICE_CREATE_FAILED
        })

        await expect(createStripeProductData({
            ...mockStripeProduct
        })).rejects.toThrow(PRICE_CREATE_FAILED)
    })

    // 作成失敗（Stripe セール価格の作成失敗）
    it('should throw error when creating sale price fails', async () => {
        const mockCreateStripeProduct = vi.mocked(createStripeProduct)
        const mockCreateStripePrice = vi.mocked(createStripePrice)

        mockCreateStripeProduct.mockResolvedValue({
            success: true,
            data: mockProductData,
            error: null
        })

        mockCreateStripePrice
            .mockResolvedValueOnce({
                success: true,
                data: mockPrice,
                error: null
            })
            .mockResolvedValueOnce({
                success: false,
                data: null,
                error: PRICE_CREATE_FAILED
            })

        await expect(createStripeProductData({
            ...mockStripeProduct,
            salePrice: 800
        })).rejects.toThrow(PRICE_CREATE_FAILED)
    })

    // 作成失敗（Stripe サブスクリプション価格の作成失敗）
    it('should handle createSubscriptionPrices exception', async () => {
        const mockCreateStripeProduct = vi.mocked(createStripeProduct)
        const mockCreateStripePrice = vi.mocked(createStripePrice)
        const mockCreateSubscriptionPrices = vi.mocked(createSubscriptionPrices)

        mockCreateStripeProduct.mockResolvedValue({
            success: true,
            data: mockProductData,
            error: null
        })

        mockCreateStripePrice.mockResolvedValue({
            success: true,
            data: mockPrice,
            error: null
        })

        mockCreateSubscriptionPrices.mockRejectedValue(
            new Error('Subscription prices creation failed')
        )

        await expect(createStripeProductData({
            ...mockStripeProduct,
            subscriptionPriceIds: 'month_1000'
        })).rejects.toThrow('Subscription prices creation failed')
    })
})

/* ==================================== 
    Process Subscription Webhook Test
==================================== */
describe('processSubscriptionWebhook', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    const mockInvoiceEvent = {
        ...mockInvoice,
        billing_reason: 'subscription_cycle',
        parent: {
            subscription_details: {
                subscription: 'sub_test_123'
            }
        }
    }

    // 処理成功（event.type が invoice.payment_succeeded の場合）
    it('should handle invoice.payment_succeeded event with subscription_cycle', async () => {
        const stripe = await getMockStripe()
        
        const mockCreateSubscriptionPayment = vi.mocked(createSubscriptionPayment)
        const mockFormatStripeSubscriptionStatus = vi.mocked(formatStripeSubscriptionStatus)

        const mockInvoiceEvent = {
            ...mockInvoice,
            billing_reason: 'subscription_cycle',
            parent: {
                subscription_details: {
                    subscription: 'sub_test_123'
                }
            }
        }

        const mockStripeEvent = {
            type: 'invoice.payment_succeeded',
            data: {
                object: mockInvoiceEvent
            }
        }

        vi.mocked(stripe.subscriptions.retrieve).mockResolvedValue({
            ...mockSubscription,
            metadata: {
                userID: 'user_test_123'
            }
        })

        mockFormatStripeSubscriptionStatus.mockReturnValue('succeeded')
        mockCreateSubscriptionPayment.mockResolvedValue({
            success: true,
            data: {
                ...mockSubscriptionPayment,
                status: 'succeeded'
            },
        })

        const result = await processSubscriptionWebhook({
            event: mockStripeEvent as unknown as StripeEvent
        })

        expect(stripe.subscriptions.retrieve).toHaveBeenCalledWith('sub_test_123')
        expect(mockFormatStripeSubscriptionStatus).toHaveBeenCalledWith('active')
        expect(mockCreateSubscriptionPayment).toHaveBeenCalledWith({
            subscriptionPaymentData: expect.objectContaining({
                user_id: 'user_test_123',
                subscription_id: 'sub_test_123',
                status: 'succeeded'
            })
        })
        expect(result).toEqual({
            success: true,
            error: null
        })
    })

    // 処理成功（event.type が invoice.payment_failed の場合）
    it('should handle invoice.payment_failed event with subscription_cycle', async () => {
        const stripe = await getMockStripe()
        
        const mockCreateSubscriptionPayment = vi.mocked(createSubscriptionPayment)
        const mockFormatStripeSubscriptionStatus = vi.mocked(formatStripeSubscriptionStatus)

        const mockInvoiceEvent = {
            ...mockInvoice,
            billing_reason: 'subscription_cycle',
            parent: {
                subscription_details: {
                    subscription: 'sub_test_123'
                }
            }
        }

        const mockStripeEvent = {
            type: 'invoice.payment_failed',
            data: {
                object: mockInvoiceEvent
            }
        }

        vi.mocked(stripe.subscriptions.retrieve).mockResolvedValue({
            ...mockSubscription,
            metadata: {
                userID: 'user_test_123'
            }
        })

        mockFormatStripeSubscriptionStatus.mockReturnValue('failed')
        mockCreateSubscriptionPayment.mockResolvedValue({
            success: true,
            data: {
                ...mockSubscriptionPayment,
                status: 'failed'
            },
        })

        const result = await processSubscriptionWebhook({
            event: mockStripeEvent as unknown as StripeEvent
        })

        expect(stripe.subscriptions.retrieve).toHaveBeenCalledWith('sub_test_123')
        expect(mockFormatStripeSubscriptionStatus).toHaveBeenCalledWith('active')
        expect(mockCreateSubscriptionPayment).toHaveBeenCalledWith({
            subscriptionPaymentData: expect.objectContaining({
                user_id: 'user_test_123',
                subscription_id: 'sub_test_123',
                status: 'failed'
            })
        })
        expect(result).toEqual({
            success: true,
            error: null
        })
    })

    // 処理成功（event.type が customer.subscription.updated の場合）
    it('should handle customer.subscription.updated event with past_due status', async () => {
        const mockUpdateSubscriptionPaymentStatus = vi.mocked(updateSubscriptionPaymentStatus)
        const mockFormatStripeSubscriptionStatus = vi.mocked(formatStripeSubscriptionStatus)

        const mockPreviousAttributes = {
            status: 'active'
        }

        const mockSubscriptionEvent = {
            ...mockSubscription,
            status: 'past_due'
        }

        const mockStripeEvent = {
            type: 'customer.subscription.updated',
            data: {
                object: mockSubscriptionEvent,
                previous_attributes: mockPreviousAttributes
            }
        }

        mockFormatStripeSubscriptionStatus.mockReturnValue('failed')
        mockUpdateSubscriptionPaymentStatus.mockResolvedValue({
            success: true,
            data: {
                ...mockSubscriptionPayment,
                status: 'failed'
            },
            error: null
        })

        const result = await processSubscriptionWebhook({
            event: mockStripeEvent as unknown as StripeEvent
        })

        expect(mockFormatStripeSubscriptionStatus).toHaveBeenCalledWith('past_due')
        expect(mockUpdateSubscriptionPaymentStatus).toHaveBeenCalledWith({
            subscriptionId: mockSubscriptionEvent.id,
            status: 'failed'
        })
        expect(result).toEqual({
            success: true,
            error: null
        })
    })

    // 処理成功（未対応のイベントタイプ）
    it('should handle unsupported event types', async () => {
        const mockStripeEvent = {
            type: 'customer.created',
            data: {
                object: {}
            }
        }

        const result = await processSubscriptionWebhook({
            event: mockStripeEvent as unknown as StripeEvent
        })

        expect(result).toEqual({
            success: true,
            error: null
        })
    })

    // 処理成功（billing_reason が subscription_cycle 以外の場合）
    it('should handle invoice.payment_succeeded with manual billing_reason', async () => {
        const stripe = await getMockStripe()

        const mockStripeEvent = {
            type: 'invoice.payment_succeeded',
            data: {
                object: {
                    ...mockInvoice,
                    billing_reason: 'manual'
                }
            }
        }

        const result = await processSubscriptionWebhook({
            event: mockStripeEvent as unknown as StripeEvent
        })

        expect(result).toEqual({
            success: true,
            error: null
        })
        expect(stripe.subscriptions.retrieve).not.toHaveBeenCalled()
    })

    // 処理成功（customer.subscription.updated で previousAttributes が null の場合）
    it('should handle customer.subscription.updated with null previousAttributes', async () => {
        const mockStripeEvent = {
            type: 'customer.subscription.updated',
            data: {
                object: mockSubscription,
                previous_attributes: null
            }
        }

        const result = await processSubscriptionWebhook({
            event: mockStripeEvent as unknown as StripeEvent
        })

        expect(result).toEqual({
            success: true,
            error: null
        })
        expect(updateSubscriptionPaymentStatus).not.toHaveBeenCalled()
    })

    // 処理失敗（subscription_id 無し）
    it('should return error when subscription_id is missing', async () => {
        const mockInvoiceEvent = {
            ...mockInvoice,
            billing_reason: 'subscription_cycle',
            parent: {
                subscription_details: {
                    subscription: null
                }
            }
        }

        const mockStripeEvent = {
            type: 'invoice.payment_succeeded',
            data: {
                object: mockInvoiceEvent
            }
        }

        const result = await processSubscriptionWebhook({
            event: mockStripeEvent as unknown as StripeEvent
        })

        expect(result).toEqual({
            success: false,
            error: SUBSCRIPTION_ERROR.NO_SUBSCRIPTION_ID
        })
    })

    // 処理失敗（subscription_id が文字列でない）
    it('should return error when subscription_id is not a string', async () => {
        const mockInvoiceEvent = {
            ...mockInvoice,
            billing_reason: 'subscription_cycle',
            parent: {
                subscription_details: {
                    subscription: 123
                }
            }
        }

        const mockStripeEvent = {
            type: 'invoice.payment_succeeded',
            data: {
                object: mockInvoiceEvent
            }
        }

        const result = await processSubscriptionWebhook({
            event: mockStripeEvent as unknown as StripeEvent
        })

        expect(result).toEqual({
            success: false,
            error: SUBSCRIPTION_ERROR.NO_SUBSCRIPTION_ID
        })
    })

    // 処理失敗（handleSubscriptionEvent の例外発生）
    it('should handle handleSubscriptionEvent exception', async () => {
        const stripe = await getMockStripe()
        
        vi.mocked(stripe.subscriptions.retrieve).mockRejectedValue(
            new Error('Subscription retrieve failed')
        )

        const mockStripeEvent = {
            type: 'invoice.payment_succeeded',
            data: {
                object: mockInvoiceEvent
            }
        }

        await expect(processSubscriptionWebhook({
            event: mockStripeEvent as unknown as StripeEvent
        })).rejects.toThrow('Subscription retrieve failed')
    })

    // 処理失敗（例外発生）
    it('should handle processSubscriptionWebhook exception', async () => {
        const stripe = await getMockStripe()

        const mockStripeEvent = {
            type: 'invoice.payment_succeeded',
            data: {
                object: mockInvoiceEvent
            }
        }

        vi.mocked(stripe.subscriptions.retrieve).mockRejectedValue(
            new Error('Stripe API Error')
        )

        await expect(processSubscriptionWebhook({
            event: mockStripeEvent as unknown as StripeEvent
        })).rejects.toThrow('Stripe API Error')
    })
})