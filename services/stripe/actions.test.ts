import { describe, it, expect, vi, beforeEach } from "vitest"

import {
    createStripeProduct,
    createStripePrice,
    createStripeCustomer,
    createSubscriptionPrices,
    getShippingRateAmount,
    updateCustomerShippingAddress,
    deleteStripeCustomer,
    cancelSubscription,
    deactivatePaymentLink
} from "@/services/stripe/actions"
import {
    extractCreateSubscriptionPrices,
    extractUpdatedSubscriptionPriceIds
} from "@/services/subscription-payment/extractors"
import {
    formatCreateSubscriptionNickname,
    getRecurringConfig
} from "@/services/subscription-payment/format"
import { 
    mockProduct, 
    mockPrice, 
    mockCustomer, 
    mockSubscription, 
    mockCheckoutSession, 
    mockPaymentLink 
} from "@/__tests__/mocks/stripe-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { STRIPE_ERROR, SHIPPING_ADDRESS_ERROR, SUBSCRIPTION_ERROR } = ERROR_MESSAGES;

const { 
    PRODUCT_CREATE_FAILED, 
    PRICE_CREATE_FAILED,
    CUSTOMER_CREATE_FAILED,
    CUSTOMER_DELETE_FAILED,
    CANCEL_SUBSCRIPTION_FAILED,
    PAYMENT_LINK_DEACTIVATE_FAILED
} = STRIPE_ERROR;
const { SET_DEFAULT_FAILED } = SHIPPING_ADDRESS_ERROR;
const { UPDATE_SUBSCRIPTION_STATUS_FAILED } = SUBSCRIPTION_ERROR;

process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key'

vi.mock('@/lib/clients/stripe/client', () => ({
    stripe: {
        products: { create: vi.fn() },
        prices: { create: vi.fn() },
        customers: { 
            create: vi.fn(),
            update: vi.fn(),
            del: vi.fn()
        },
        shippingRates: { retrieve: vi.fn() },
        subscriptions: { update: vi.fn() },
        paymentLinks: { update: vi.fn() }
    }
}))

vi.mock('@/services/subscription-payment/extractors', () => ({
    extractCreateSubscriptionPrices: vi.fn(),
    extractUpdatedSubscriptionPriceIds: vi.fn()
}))

vi.mock('@/services/subscription-payment/format', () => ({
    formatCreateSubscriptionNickname: vi.fn(),
    getRecurringConfig: vi.fn()
}))

vi.mock('@/services/order-item-subscription/actions', () => ({
    updateOrderItemSubscriptionStatus: vi.fn()
}))

const getMockStripe = async () => {
    const { stripe } = await import('@/lib/clients/stripe/client')
    return vi.mocked(stripe)
}

const getMockUpdateOrderItemSubscriptionStatus = async () => {
    const { updateOrderItemSubscriptionStatus } = await import('@/services/order-item-subscription/actions')
    return vi.mocked(updateOrderItemSubscriptionStatus)
}

/* ==================================== 
    Create Stripe Product Test
==================================== */
describe('createStripeProduct', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create stripe product successfully', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.products.create).mockResolvedValue({
            ...mockProduct
        })
    
        const result = await createStripeProduct({
            name: 'test-product',
            metadata: {
                supabase_id: 'test-product-id'
            }
        })
    
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 作成失敗
    it('should return error when creating stripe product fails', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.products.create).mockRejectedValue(new Error('Stripe API Error'))
    
        const result = await createStripeProduct({
            name: '',
            metadata: {
                supabase_id: ''
            }
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(PRODUCT_CREATE_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Create Stripe Price Test
==================================== */
describe('createStripePrice', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create stripe price successfully', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.prices.create).mockResolvedValue({
            ...mockPrice
        })
    
        const result = await createStripePrice({
            product: 'test-product-id',
            unit_amount: 1000,
            currency: 'jpy',
            nickname: 'test-price',
            recurring: {
                interval: 'month',
                interval_count: 1
            }
        })
    
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 作成失敗
    it('should return error when creating stripe price fails', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.prices.create).mockRejectedValue(new Error('Stripe API Error'))
    
        const result = await createStripePrice({
            product: '',
            unit_amount: 1000,
            currency: 'jpy',
            nickname: '',
            recurring: {
                interval: 'day',
                interval_count: undefined
            }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(PRICE_CREATE_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Create Stripe Customer Test
==================================== */
describe('createStripeCustomer', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create stripe customer successfully', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.customers.create).mockResolvedValue({
            ...mockCustomer
        })
    
        const result = await createStripeCustomer({
            email: 'test@example.com',
            lastname: 'test',
            firstname: 'test'
        })
    
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 作成失敗
    it('should return error when creating stripe customer fails', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.customers.create).mockRejectedValue(new Error('Stripe API Error'))
    
        const result = await createStripeCustomer({
            email: '',
            lastname: '',
            firstname: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CUSTOMER_CREATE_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Create Subscription Prices Test
==================================== */
describe('createSubscriptionPrices', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create subscription prices successfully', async () => {
        const mockExtractCreateSubscriptionPrices = vi.mocked(extractCreateSubscriptionPrices)
        const mockFormatCreateSubscriptionNickname = vi.mocked(formatCreateSubscriptionNickname)
        const mockGetRecurringConfig = vi.mocked(getRecurringConfig)
        const mockExtractUpdatedSubscriptionPriceIds = vi.mocked(extractUpdatedSubscriptionPriceIds)
    
        const productData = { ...mockProduct }
        const subscriptionPriceIds = 'day_1000\nweek_2000'
    
        mockExtractCreateSubscriptionPrices.mockReturnValue([
            { interval: '1day', price: 1000 },
            { interval: '1week', price: 2000 },
        ])
    
        mockFormatCreateSubscriptionNickname.mockReturnValue('Daily')
        mockGetRecurringConfig.mockReturnValue({ interval: 'day', interval_count: 1 })
    
        const stripe = await getMockStripe()
        
        vi.mocked(stripe.prices.create)
            .mockResolvedValueOnce({
                ...mockPrice,
                id: 'price_day_1000'
            })
            .mockResolvedValueOnce({
                ...mockPrice,
                id: 'price_week_2000'
            })
    
        mockExtractUpdatedSubscriptionPriceIds.mockReturnValue('updated-price-ids')
    
        const result = await createSubscriptionPrices({
            productData,
            subscriptionPriceIds
        })
    
        expect(result).toBe('updated-price-ids')
        expect(mockExtractUpdatedSubscriptionPriceIds).toHaveBeenCalledWith(
            subscriptionPriceIds,
            [
                { interval: '1day', priceId: 'price_day_1000', price: 1000 },
                { interval: '1week', priceId: 'price_week_2000', price: 2000 }
            ]
        )
    })

    // 作成失敗(subscriptionPriceIdsがnullの場合)
    it('should return original value when subscriptionPriceIds is null', async () => {
        const result = await createSubscriptionPrices({
            productData: { ...mockProduct },
            subscriptionPriceIds: null
        })
    
        expect(result).toBeNull()
    })

    // 作成失敗(recurringConfigがnullの場合)
    it('should return subscription price ids when recurring config is null', async () => {
        const mockExtractCreateSubscriptionPrices = vi.mocked(extractCreateSubscriptionPrices)
        const mockGetRecurringConfig = vi.mocked(getRecurringConfig)
        const mockExtractUpdatedSubscriptionPriceIds = vi.mocked(extractUpdatedSubscriptionPriceIds)
    
        const productData = { ...mockProduct }
        const subscriptionPriceIds = 'day_1000\nweek_2000'
    
        mockExtractCreateSubscriptionPrices.mockReturnValue([
            { interval: '1day', price: 1000 }
        ])
        
        mockGetRecurringConfig.mockReturnValue(null)
        mockExtractUpdatedSubscriptionPriceIds.mockReturnValue(subscriptionPriceIds)
    
        const result = await createSubscriptionPrices({
            productData,
            subscriptionPriceIds
        })
    
        expect(result).toBe(subscriptionPriceIds)
        expect(mockExtractUpdatedSubscriptionPriceIds).toHaveBeenCalledWith(
            subscriptionPriceIds,
            []
        )
    })

    // 作成失敗(Stripe 価格の作成失敗)
    it('should handle stripe price creation failure', async () => {
        const mockExtractCreateSubscriptionPrices = vi.mocked(extractCreateSubscriptionPrices)
        const mockGetRecurringConfig = vi.mocked(getRecurringConfig)
        const mockExtractUpdatedSubscriptionPriceIds = vi.mocked(extractUpdatedSubscriptionPriceIds)
    
        const productData = { ...mockProduct }
        const subscriptionPriceIds = 'day_1000'
    
        mockExtractCreateSubscriptionPrices.mockReturnValue([
            { interval: '1day', price: 1000 }
        ])
        
        mockGetRecurringConfig.mockReturnValue({ interval: 'day', interval_count: 1 })
        
        const stripe = await getMockStripe()
        vi.mocked(stripe.prices.create).mockRejectedValue(new Error('Stripe API Error'))
        
        mockExtractUpdatedSubscriptionPriceIds.mockReturnValue(subscriptionPriceIds)
    
        const result = await createSubscriptionPrices({
            productData,
            subscriptionPriceIds
        })
    
        expect(result).toBe(subscriptionPriceIds)
        expect(mockExtractUpdatedSubscriptionPriceIds).toHaveBeenCalledWith(
            subscriptionPriceIds,
            []
        )
    })

    // 作成失敗（例外発生）
    it('should throw error when exception occurs', async () => {
        const mockExtractCreateSubscriptionPrices = vi.mocked(extractCreateSubscriptionPrices)
    
        const productData = { ...mockProduct }
        const subscriptionPriceIds = 'day_1000'
    
        mockExtractCreateSubscriptionPrices.mockImplementation(() => {
            throw new Error('Extraction failed')
        })
    
        await expect(createSubscriptionPrices({
            productData,
            subscriptionPriceIds
        })).rejects.toThrow('Extraction failed')
    })
})

/* ==================================== 
    Get Shipping Rate Amount Test
==================================== */
describe('getShippingRateAmount', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should get shipping rate amount successfully', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.shippingRates.retrieve).mockResolvedValue({
            id: 'shr_test_123',
            object: 'shipping_rate',
            active: true,
            created: 1234567890,
            delivery_estimate: null,
            display_name: 'Standard Shipping',
            fixed_amount: {
                currency: 'jpy',
                amount: 1000
            },
            livemode: false,
            metadata: {},
            tax_behavior: null,
            tax_code: null,
            type: 'fixed_amount',
            lastResponse: {
                headers: {},
                requestId: 'req_test_123',
                statusCode: 200,
                apiVersion: '2023-10-16',
                idempotencyKey: undefined,
                stripeAccount: undefined
            }
        })
        
        const result = await getShippingRateAmount('test-shipping-rate-id')

        expect(result.success).toBe(true)
        expect(result.data).toBe(1000)
    })

    // 取得失敗
    it('should return 0 when getting shipping rate amount fails', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.shippingRates.retrieve).mockRejectedValue(
            new Error('Stripe API Error')
        )
        
        const result = await getShippingRateAmount('test-shipping-rate-id')

        expect(result.success).toBe(false)
        expect(result.data).toBe(0)
    })
})

/* ==================================== 
    Update Customer Shipping Address Test
==================================== */
describe('updateCustomerShippingAddress', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 更新成功
    it('should update customer shipping address successfully', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.customers.update).mockResolvedValue({
            ...mockCustomer
        })
        
        const result = await updateCustomerShippingAddress('test-customer-id', {
            address: {
                line1: '123 Main St',
                line2: 'Apt 4B',
                city: 'Anytown',
                state: 'CA',
                postal_code: '12345',
                country: 'JP'
            },
            name: 'John Doe',
            phone: '1234567890'
        })
        
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 更新失敗
    it('should return error when updating customer shipping address fails', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.customers.update).mockRejectedValue(
            new Error('Stripe API Error')
        )
        
        const result = await updateCustomerShippingAddress('test-customer-id', {
            address: {
                line1: '',
                line2: '',
                city: '',
                state: '',
                postal_code: '',
                country: 'JP'
            },
            name: '',
            phone: ''
        })
        
        expect(result.success).toBe(false)
        expect(result.error).toBe(SET_DEFAULT_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Delete Stripe Customer Test
==================================== */
describe('deleteStripeCustomer', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 削除成功
    it('should delete stripe customer successfully', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.customers.del).mockResolvedValue({
            ...mockCustomer,
            deleted: true 
        })
        
        const result = await deleteStripeCustomer({
            customerId: 'test-customer-id'
        })
        
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 削除失敗
    it('should return error when deleting stripe customer fails', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.customers.del).mockRejectedValue(
            new Error('Stripe API Error')
        )

        const result = await deleteStripeCustomer({
            customerId: 'test-customer-id'
        })
        
        expect(result.success).toBe(false)
        expect(result.error).toBe(CUSTOMER_DELETE_FAILED)
    })
})

/* ==================================== 
    Cancel Subscription Test
==================================== */
describe('cancelSubscription', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // キャンセル成功
    it('should cancel subscription successfully', async () => {
        const stripe = await getMockStripe()

        const updateOrderItemSubscriptionStatus = await getMockUpdateOrderItemSubscriptionStatus()
        vi.mocked(updateOrderItemSubscriptionStatus).mockResolvedValue({
            success: true,
            error: null
        })

        vi.mocked(stripe.subscriptions.update).mockResolvedValue({
            ...mockSubscription,
        })
        
        const result = await cancelSubscription({
            subscriptionId: 'test-subscription-id'
        })
        
        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
    })

    // キャンセル失敗(Stripe の更新失敗)
    it('should return error when stripe subscription update fails', async () => {
        const stripe = await getMockStripe()

        const updateOrderItemSubscriptionStatus = await getMockUpdateOrderItemSubscriptionStatus()
        vi.mocked(updateOrderItemSubscriptionStatus).mockResolvedValue({
            success: false,
            error: UPDATE_SUBSCRIPTION_STATUS_FAILED
        })

        vi.mocked(stripe.subscriptions.update).mockResolvedValue({
            ...mockSubscription,
        })

        const result = await cancelSubscription({
            subscriptionId: 'test-subscription-id'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(UPDATE_SUBSCRIPTION_STATUS_FAILED)
    })

    // キャンセル失敗(サブスクリプションの契約状況の更新失敗)
    it('should return error when update order item subscription status fails', async () => {
        const updateOrderItemSubscriptionStatus = await getMockUpdateOrderItemSubscriptionStatus()
        vi.mocked(updateOrderItemSubscriptionStatus).mockRejectedValue(
            new Error('Database error')
        )

        const result = await cancelSubscription({
            subscriptionId: 'test-subscription-id'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CANCEL_SUBSCRIPTION_FAILED)
    })

    // キャンセル失敗(例外発生)
    it('should return error when update order item subscription status fails', async () => {
        const stripe = await getMockStripe()

        const updateOrderItemSubscriptionStatus = await getMockUpdateOrderItemSubscriptionStatus()
        vi.mocked(updateOrderItemSubscriptionStatus).mockResolvedValue({
            success: true,
            error: null
        })

        vi.mocked(stripe.subscriptions.update).mockRejectedValue(
            new Error('Stripe API Error')
        )
        
        const result = await cancelSubscription({
            subscriptionId: 'test-subscription-id'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CANCEL_SUBSCRIPTION_FAILED)
    })
})

/* ==================================== 
    Deactivate Payment Link Test
==================================== */
describe('deactivatePaymentLink', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 無効化成功
    it('should deactivate payment link successfully', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.paymentLinks.update).mockResolvedValue({
            ...mockPaymentLink
        })
    
        const result = await deactivatePaymentLink({
            checkoutSessionEvent: { ...mockCheckoutSession }
        })
    
        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(stripe.paymentLinks.update).toHaveBeenCalledWith('plink_test_123', {
            active: false
        })
    })

    // 無効化失敗(payment_link が文字列でない場合)
    it('should return error when payment link is not a string', async () => {
        const stripe = await getMockStripe()

        const result = await deactivatePaymentLink({
            checkoutSessionEvent: {
                ...mockCheckoutSession,
                payment_link: null
            }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(PAYMENT_LINK_DEACTIVATE_FAILED)
        expect(stripe.paymentLinks.update).not.toHaveBeenCalled()
    })

    // 無効化失敗(payment_link が undefined の場合)
    it('should return error when payment_link is undefined', async () => {
        const stripe = await getMockStripe()

        const result = await deactivatePaymentLink({
            checkoutSessionEvent: {
                ...mockCheckoutSession,
                payment_link: undefined as unknown as StripeCheckoutSession['payment_link']
            }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(PAYMENT_LINK_DEACTIVATE_FAILED)
        expect(stripe.paymentLinks.update).not.toHaveBeenCalled()
    })

    // 無効化失敗(Stripe の更新失敗)
    it('should return error when stripe payment link update fails', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.paymentLinks.update).mockRejectedValue(
            new Error('Stripe API Error')
        )

        const result = await deactivatePaymentLink({
            checkoutSessionEvent: { ...mockCheckoutSession }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(PAYMENT_LINK_DEACTIVATE_FAILED)
        expect(stripe.paymentLinks.update).toHaveBeenCalledWith('plink_test_123', {
            active: false
        })
    })
})