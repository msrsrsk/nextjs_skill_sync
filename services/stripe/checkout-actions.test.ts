import { describe, it, expect, vi, beforeEach } from "vitest"
import type Stripe from "stripe"

import {
    getShippingRateId,
    getSubscriptionShippingFee,
    getPaymentMethod,
    getCheckoutSession,
    createCheckoutSession,
    createPaymentLink,
    processCheckoutItems,
    processCheckoutSessionCompleted
} from "@/services/stripe/checkout-actions"
import { getUser } from "@/services/user/actions"
import { getShippingRateAmount } from "@/services/stripe/actions"
import { getRecurringConfig } from "@/services/subscription-payment/format"
import { processOrderData } from "@/services/stripe/webhook-actions"
import { updateProductStockAndSoldCount } from "@/services/order/actions"
import { processShippingAddress } from "@/services/stripe/webhook-actions"
import { sendOrderCompleteEmail } from "@/services/email/order/confirmation"
import { sendOrderEmails } from "@/services/stripe/webhook-actions"
import { deactivatePaymentLink } from "@/services/stripe/actions"
import { 
    mockSubscription, 
    mockInvoice,
    mockCheckoutSession,
    mockPaymentIntent,
    mockPaymentLink,
    mockPrice,
    mockShippingRate,
} from "@/__tests__/mocks/stripe-mocks"
import { 
    mockUser, 
    mockOrderData, 
    createCombinedProductDetails,
    createCombinedCartItems
} from "@/__tests__/mocks/domain-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { 
    CHECKOUT_ERROR, 
    USER_STRIPE_ERROR, 
    PRODUCT_ERROR,
    EMAIL_ERROR,
    STRIPE_ERROR,
    SHIPPING_ADDRESS_ERROR
} = ERROR_MESSAGES;

const { 
    SUBSCRIPTION_SHIPPING_FEE_FAILED, 
    PAYMENT_METHOD_FAILED, 
    NO_LINE_ITEMS,
    NO_USER_ID,
    INVALID_QUANTITY,
    CHECKOUT_SESSION_FAILED,
    NO_SUBSCRIPTION_INTERVAL,
    PAYMENT_LINK_FAILED,
    NO_PRODUCT_DATA,
    PRICE_VERIFICATION_FAILED,
    NO_PRICE_AMOUNT,
    NO_SHIPPING_RATE_ID,
    NO_SHIPPING_RATE_AMOUNT,
    AMOUNT_TOTAL_MISMATCH,
    ORDER_DATA_PROCESS_FAILED,
    NO_PRICE_ID,
    SESSION_RETRIEVAL_FAILED,
} = CHECKOUT_ERROR;
const { CUSTOMER_ID_FETCH_FAILED } = USER_STRIPE_ERROR;
const { UPDATE_STOCK_AND_SOLD_COUNT_FAILED } = PRODUCT_ERROR;
const { ORDER_SEND_FAILED } = EMAIL_ERROR;
const { PAYMENT_LINK_DEACTIVATE_FAILED } = STRIPE_ERROR;

vi.stubEnv('STRIPE_SHIPPING_FREE_RATE_ID', 'shr_free_test_123')
vi.stubEnv('STRIPE_SHIPPING_REGULAR_RATE_ID', 'shr_regular_test_123')

vi.mock('@/lib/clients/stripe/client', () => ({
    stripe: {
        subscriptions: { retrieve: vi.fn() },
        invoices: { retrieve: vi.fn() },
        paymentIntents: { retrieve: vi.fn() },
        checkout: { sessions: { retrieve: vi.fn(), create: vi.fn() } },
        paymentLinks: { create: vi.fn() },
        prices: { retrieve: vi.fn() },
        shippingRates: { retrieve: vi.fn() }
    }
}))

vi.mock('@/services/user/actions', () => ({
    getUser: vi.fn()
}))

vi.mock('@/services/stripe/actions', () => ({
    getShippingRateAmount: vi.fn(),
    deactivatePaymentLink: vi.fn()
}))

vi.mock('@/services/stripe/webhook-actions', () => ({
    processOrderData: vi.fn(),
    sendOrderEmails: vi.fn(),
    processShippingAddress: vi.fn()
}))

vi.mock('@/services/order/actions', () => ({
    updateProductStockAndSoldCount: vi.fn()
}))

vi.mock('@/services/email/order/confirmation', () => ({
    sendOrderCompleteEmail: vi.fn()
}))

vi.mock('@/services/subscription-payment/format', () => ({
    getRecurringConfig: vi.fn()
}))

vi.mock('@/services/subscription-payment/format', () => ({
    getRecurringConfig: vi.fn()
}))

const getMockStripe = async () => {
    const { stripe } = await import('@/lib/clients/stripe/client')
    return vi.mocked(stripe)
}

/* ==================================== 
    Get Shipping Rate Id Test
==================================== */
describe('getShippingRateId', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 無料配送の閾値を超える
    it('should return free shipping rate ID when totalQuantity meets threshold', () => {
        const result = getShippingRateId({ totalQuantity: 11 })
        expect(result).toBe('shr_free_test_123')
    })

    // 無料配送の閾値未満
    it('should return regular shipping rate ID when totalQuantity is below threshold', () => {
        const result = getShippingRateId({ totalQuantity: 9 })
        expect(result).toBe('shr_regular_test_123')
    })
})

/* ==================================== 
    Get Subscription Shipping Fee Test
==================================== */
describe('getSubscriptionShippingFee', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should get subscription shipping fee successfully', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.subscriptions.retrieve).mockResolvedValue({
            ...mockSubscription,
        })

        vi.mocked(stripe.invoices.retrieve).mockResolvedValue({
            ...mockInvoice
        })

        const result = await getSubscriptionShippingFee({
            session: { 
                ...mockCheckoutSession,
                subscription: 'sub_test_123'
            },
            subscriptionShippingFee: 1000
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBe(1000) // subscription_shipping_fee の値
    })

    // 取得失敗(session.subscription が null または undefined)
    it('should return 0 when session.subscription is null or undefined', async () => {
        const result = await getSubscriptionShippingFee({
            session: { 
                ...mockCheckoutSession, 
                subscription: null 
            },
            subscriptionShippingFee: 0
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(SUBSCRIPTION_SHIPPING_FEE_FAILED)
        expect(result.data).toBe(0)
    })

    // 取得失敗(subscription.latest_invoice が null または undefined)
    it('should return 0 when subscription.latest_invoice is null or undefined', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.subscriptions.retrieve).mockResolvedValue({
            ...mockSubscription,
            latest_invoice: null,
        })

        vi.mocked(stripe.invoices.retrieve).mockResolvedValue({
            ...mockInvoice
        })

        const result = await getSubscriptionShippingFee({
            session: { 
                ...mockCheckoutSession,
                subscription: 'sub_test_123'
            },
            subscriptionShippingFee: 0
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(SUBSCRIPTION_SHIPPING_FEE_FAILED)
        expect(result.data).toBe(0)
    })

    // 取得失敗(stripe.subscriptions.retrieve の失敗)
    it('should return 0 when stripe.subscriptions.retrieve fails', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.subscriptions.retrieve).mockRejectedValue(
            new Error('Stripe API Error')
        )

        const result = await getSubscriptionShippingFee({
            session: { 
                ...mockCheckoutSession,
                subscription: 'sub_test_123'
            },
            subscriptionShippingFee: 0
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(SUBSCRIPTION_SHIPPING_FEE_FAILED)
        expect(result.data).toBe(0)
    })

    // 取得失敗(stripe.invoices.retrieve の失敗)
    it('should return 0 when stripe.invoices.retrieve fails', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.subscriptions.retrieve).mockResolvedValue({
            ...mockSubscription,
        })

        vi.mocked(stripe.invoices.retrieve).mockRejectedValue(
            new Error('Stripe API Error')
        )

        const result = await getSubscriptionShippingFee({
            session: { 
                ...mockCheckoutSession,
                subscription: 'sub_test_123'
            },
            subscriptionShippingFee: 0
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(SUBSCRIPTION_SHIPPING_FEE_FAILED)
        expect(result.data).toBe(0)
    })

    // 取得失敗（メタデータが空の場合）
    it('should handle empty string subscription_shipping_fee', async () => {
        const stripe = await getMockStripe()
    
        vi.mocked(stripe.subscriptions.retrieve).mockResolvedValue({
            ...mockSubscription,
            latest_invoice: 'in_test_123'
        })
    
        vi.mocked(stripe.invoices.retrieve).mockResolvedValue({
            ...mockInvoice,
            parent: {
                subscription_details: {
                    subscription: mockSubscription,
                    metadata: {
                        subscription_shipping_fee: '' // メタデータ
                    }
                },
                quote_details: null,
                type: 'subscription' as Stripe.Invoice.Parent.Type
            }
        })
    
        const result = await getSubscriptionShippingFee({
            session: { 
                ...mockCheckoutSession,
                subscription: 'sub_test_123'
            },
            subscriptionShippingFee: 0
        })
    
        expect(result.success).toBe(true)
        expect(result.data).toBe(0)
    })
})

/* ==================================== 
    Get Payment Method Test
==================================== */
describe('getPaymentMethod', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should get payment method successfully', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.paymentIntents.retrieve).mockResolvedValue({
            ...mockPaymentIntent,
        })

        const result = await getPaymentMethod({
            session: { 
                ...mockCheckoutSession,
                payment_intent: 'pi_test_123'
            },
            cardBrand: 'visa'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBe('visa')
    })

    // 取得失敗(session.payment_intent が null または undefined)
    it('should return default card when payment_intent is null or undefined', async () => {
        const result = await getPaymentMethod({
            session: { 
                ...mockCheckoutSession,
                payment_intent: null
            },
            cardBrand: 'card'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBe('card')
    })

    // 取得失敗(sessionWithPaymentMethod.payment_method が無い場合)
    it('should return default card when payment_method is null or undefined', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.paymentIntents.retrieve).mockResolvedValue({
            ...mockPaymentIntent,
            payment_method: null
        })

        const result = await getPaymentMethod({
            session: { 
                ...mockCheckoutSession,
                payment_intent: 'pi_test_123'
            },
            cardBrand: 'card'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBe('card')
    })

    // 取得失敗(例外発生)
    it('should return error when stripe.paymentIntents.retrieve fails', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.paymentIntents.retrieve).mockRejectedValue(
            new Error('Stripe API Error')
        )

        const result = await getPaymentMethod({
            session: { 
                ...mockCheckoutSession,
                payment_intent: 'pi_test_123'
            },
            cardBrand: 'card'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(PAYMENT_METHOD_FAILED)
        expect(result.data).toBe('card')
    })
})

/* ==================================== 
    Get Checkout Session Test
==================================== */
describe('getCheckoutSession', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should retrieve checkout session successfully', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.checkout.sessions.retrieve).mockResolvedValue({
            ...mockCheckoutSession,
        })

        const result = await getCheckoutSession({
            sessionId: mockCheckoutSession.id
        })

        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
        expect(stripe.checkout.sessions.retrieve).toHaveBeenCalledWith(
            mockCheckoutSession.id,
            { expand: ['line_items'] }
        )
    })

    // 取得失敗(Stripe API エラー)
    it('should return error when stripe.checkout.sessions.retrieve fails', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.checkout.sessions.retrieve).mockRejectedValue(
            new Error('Stripe API Error')
        )

        const result = await getCheckoutSession({
            sessionId: mockCheckoutSession.id
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(SESSION_RETRIEVAL_FAILED)
        expect(result.data).toBeNull()
        expect(stripe.checkout.sessions.retrieve).toHaveBeenCalledWith(
            mockCheckoutSession.id,
            { expand: ['line_items'] }
        )
    })

    // 取得失敗(sessionId が空)
    it('should return error when sessionId is empty', async () => {
        const stripe = await getMockStripe()

        vi.mocked(stripe.checkout.sessions.retrieve).mockRejectedValue(
            new Error('Empty session ID')
        )

        const result = await getCheckoutSession({
            sessionId: '' as StripeCheckoutSessionId
        })

        expect(result.error).toBe(SESSION_RETRIEVAL_FAILED)
        expect(result.success).toBe(false)
        expect(result.data).toBeNull()
        expect(stripe.checkout.sessions.retrieve).toHaveBeenCalledWith(
            '',
            { expand: ['line_items'] }
        )
    })
})

/* ==================================== 
    Create Checkout Session Test
==================================== */
describe('createCheckoutSession', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create checkout session successfully', async () => {
        const stripe = await getMockStripe()

        vi.mocked(getUser).mockResolvedValue(mockUser)
        vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
            ...mockCheckoutSession,
            id: 'cs_test_123'
        })

        const result = await createCheckoutSession({
            lineItems: [
                { price: 'price_test_123', quantity: 2 }
            ],
            userId: 'user_test_123',
            totalQuantity: 5
        })

        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
        expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
            expect.objectContaining({
                payment_method_types: ['card'],
                currency: 'jpy',
                customer: 'cus_test_123',
                mode: 'payment',
                metadata: {
                    userID: 'user_test_123'
                }
            })
        )
    })

    // 配送料設定テスト（無料配送）
    it('should use free shipping rate when totalQuantity meets threshold', async () => {
        const stripe = await getMockStripe()

        vi.mocked(getUser).mockResolvedValue(mockUser)
        vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
            ...mockCheckoutSession
        })

        await createCheckoutSession({
            lineItems: [{ price: 'price_test_123', quantity: 1 }],
            userId: 'user_test_123',
            totalQuantity: 11 // 無料配送の閾値を超える
        })

        expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
            expect.objectContaining({
                shipping_options: [
                    {
                        shipping_rate: 'shr_free_test_123'
                    }
                ]
            })
        )
    })

    // 配送料設定テスト（通常配送）
    it('should use regular shipping rate when totalQuantity is below threshold', async () => {
        const stripe = await getMockStripe()

        vi.mocked(getUser).mockResolvedValue(mockUser)
        vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
            ...mockCheckoutSession
        })

        await createCheckoutSession({
            lineItems: [{ price: 'price_test_123', quantity: 1 }],
            userId: 'user_test_123',
            totalQuantity: 2 // 無料配送の閾値未満
        })

        expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
            expect.objectContaining({
                shipping_options: [
                    {
                        shipping_rate: 'shr_regular_test_123'
                    }
                ]
            })
        )
    })

    // 作成失敗(商品リストが空)
    it('should return error when lineItems is empty', async () => {
        const result = await createCheckoutSession({
            lineItems: [],
            userId: 'user_test_123',
            totalQuantity: 5
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(NO_LINE_ITEMS)
        expect(result.data).toBeNull()
    })

    // 作成失敗(getUser が null)
    it('should return error when userId is null', async () => {
        const result = await createCheckoutSession({
            lineItems: [{ price: 'price_test_123', quantity: 1 }],
            userId: null as unknown as UserId,
            totalQuantity: 5
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(NO_USER_ID)
        expect(result.data).toBeNull()
    })

    // 作成失敗(totalQuantityが負の数)
    it('should return error when totalQuantity is negative', async () => {
        const result = await createCheckoutSession({
            lineItems: [{ price: 'price_test_123', quantity: 1 }],
            userId: 'user_test_123',
            totalQuantity: -5
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(INVALID_QUANTITY)
        expect(result.data).toBeNull()
    })

    // 作成失敗(getUser の取得失敗)
    it('should handle user fetch failure', async () => {
        vi.mocked(getUser).mockResolvedValue(null)

        const result = await createCheckoutSession({
            lineItems: [
                { price: 'price_test_123', quantity: 2 }
            ],
            userId: 'user_test_123',
            totalQuantity: 5
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CUSTOMER_ID_FETCH_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗(shippingRateId が null)
    it('should return error when shipping rate ID is null', async () => {
        vi.stubEnv('STRIPE_SHIPPING_FREE_RATE_ID', undefined)
        vi.stubEnv('STRIPE_SHIPPING_REGULAR_RATE_ID', undefined)

        const result = await createCheckoutSession({
            lineItems: [{ price: 'price_test_123', quantity: 1 }],
            userId: 'user_test_123',
            totalQuantity: 5
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CHECKOUT_ERROR.NO_SHIPPING_RATE_FOUND)
        expect(result.data).toBeNull()

        vi.stubEnv('STRIPE_SHIPPING_FREE_RATE_ID', 'shr_free_test_123')
        vi.stubEnv('STRIPE_SHIPPING_REGULAR_RATE_ID', 'shr_regular_test_123')
    })

    // 作成失敗(顧客ID無し)
    // 初回注文は顧客IDがないため、作成成功
    it('should handle missing customer_id', async () => {
        const mockUserWithoutCustomerId = {
            ...mockUser,
            user_stripes: {
                ...mockUser.user_stripes,
                customer_id: null as unknown as string,
            }
        }
        vi.mocked(getUser).mockResolvedValue(mockUserWithoutCustomerId)
    
        const result = await createCheckoutSession({
            lineItems: [{ price: 'price_test_123', quantity: 1 }],
            userId: 'user_test_123',
            totalQuantity: 5
        })
    
        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
    })

    // 作成失敗(例外発生)
    it('should return error when exception occurs', async () => {
        const stripe = await getMockStripe()

        vi.mocked(getUser).mockResolvedValue(mockUser)
        vi.mocked(stripe.checkout.sessions.create).mockRejectedValue(
            new Error('Stripe API Error')
        )

        const result = await createCheckoutSession({
            lineItems: [{ price: 'price_test_123', quantity: 1 }],
            userId: 'user_test_123',
            totalQuantity: 5
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CHECKOUT_SESSION_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Create Payment Link Test
==================================== */
describe('createPaymentLink', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create payment link successfully', async () => {
        const stripe = await getMockStripe()

        vi.mocked(getShippingRateAmount).mockResolvedValue({
            success: true,
            data: 1000
        })

        vi.mocked(getRecurringConfig).mockResolvedValue({
            interval: 'month',
            interval_count: 1
        })

        vi.mocked(stripe.paymentLinks.create).mockResolvedValue({
            ...mockPaymentLink
        })
        
        const result = await createPaymentLink({
            lineItems: [{ price: 'price_test_123', quantity: 1 }],
            userId: 'user_test_123',
            userEmail: 'test@example.com',
            interval: 'month'
        })

        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
    })

    // 作成失敗(配送料の取得失敗)
    it('should return error when shipping rate amount is not found', async () => {
        vi.mocked(getShippingRateAmount).mockResolvedValue({
            success: false,
            data: 0
        })

        const result = await createPaymentLink({
            lineItems: [{ price: 'price_test_123', quantity: 1 }],
            userId: 'user_test_123',
            userEmail: 'test@example.com',
            interval: 'month'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(NO_SUBSCRIPTION_INTERVAL)
    })

    // 作成失敗(interval が null)
    it('should return error when interval is null', async () => {
        vi.mocked(getRecurringConfig).mockResolvedValue(null)
        
        const result = await createPaymentLink({
            lineItems: [{ price: 'price_test_123', quantity: 1 }],
            userId: 'user_test_123',
            userEmail: 'test@example.com',
            interval: 'month'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(NO_SUBSCRIPTION_INTERVAL)
    })

    // 作成失敗(paymentLink の作成失敗)
    it('should return error when payment link creation fails', async () => {
        const stripe = await getMockStripe()

        vi.mocked(getShippingRateAmount).mockResolvedValue({
            success: true,
            data: 1000
        })

        vi.mocked(getRecurringConfig).mockResolvedValue({
            interval: 'month',
            interval_count: 1
        })

        vi.mocked(stripe.paymentLinks.create).mockRejectedValue(
            new Error('Stripe API Error')
        )
        
        const result = await createPaymentLink({
            lineItems: [{ price: 'price_test_123', quantity: 1 }],
            userId: 'user_test_123',
            userEmail: 'test@example.com',
            interval: 'month'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(PAYMENT_LINK_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Process Checkout Items Test
==================================== */
describe('processCheckoutItems', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockAddedCheckoutSession = {
        ...mockCheckoutSession,
        amount_total: 2500,
        url: 'https://checkout.stripe.com/test'
    }

    // 作成成功
    it('should process checkout items successfully', async () => {
        const stripe = await getMockStripe()

        vi.mocked(getUser).mockResolvedValue(mockUser)
    
        vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
            ...mockAddedCheckoutSession
        })
        
        vi.mocked(stripe.prices.retrieve).mockResolvedValue({
            ...mockPrice,
            unit_amount: 1000
        })
    
        vi.mocked(stripe.shippingRates.retrieve).mockResolvedValue({
            ...mockShippingRate
        })
    
        const result = await processCheckoutItems({
            userId: 'user_test_123',
            cartItems: createCombinedCartItems()
        })
    
        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
    })

    // 作成失敗(商品データ無し)
    it('should return error when product data is not found', async () => {
        const stripe = await getMockStripe()

        vi.mocked(getUser).mockResolvedValue(mockUser)
    
        vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
            ...mockAddedCheckoutSession
        })
        
        vi.mocked(stripe.prices.retrieve).mockResolvedValue({
            ...mockPrice,
            unit_amount: 1000
        })
    
        vi.mocked(stripe.shippingRates.retrieve).mockResolvedValue({
            ...mockShippingRate
        })
    
        const result = await processCheckoutItems({
            userId: 'user_test_123',
            cartItems: [{
                ...createCombinedCartItems()[0],
                product: null as unknown as ProductWithRelations
            }]
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(NO_PRODUCT_DATA)
    })

    // 作成失敗(priceId が null)
    it('should return error when priceId is null', async () => {
        vi.mocked(getUser).mockResolvedValue(mockUser)
        
        const result = await processCheckoutItems({
            userId: 'user_test_123',
            cartItems: [{
                ...createCombinedCartItems()[0],
                product: {
                    ...createCombinedCartItems()[0].product,
                    product_stripes: {
                        id: 'stripe_product_123',
                        product_id: 'product_test_123',
                        stripe_product_id: 'prod_test_123',
                        sale_price_id: null,
                        regular_price_id: null,
                        subscription_price_ids: null,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                }
            }]
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(NO_PRICE_ID)
    })

    // 作成失敗(価格の取得失敗)
    it('should return error when price retrieval fails', async () => {
        const stripe = await getMockStripe()

        vi.mocked(getUser).mockResolvedValue(mockUser)
    
        vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
            ...mockAddedCheckoutSession
        })
        
        vi.mocked(stripe.prices.retrieve).mockRejectedValue(
            new Error('Stripe API Error')
        )
    
        const result = await processCheckoutItems({
            userId: 'user_test_123',
            cartItems: createCombinedCartItems()
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(PRICE_VERIFICATION_FAILED)
    })

    // 作成失敗(price.unit_amount が null)
    it('should return error when price.unit_amount is null', async () => {
        const stripe = await getMockStripe()

        vi.mocked(getUser).mockResolvedValue(mockUser)
    
        vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
            ...mockAddedCheckoutSession
        })
        
        vi.mocked(stripe.prices.retrieve).mockResolvedValue({
            ...mockPrice,
            unit_amount: null
        })
    
        const result = await processCheckoutItems({
            userId: 'user_test_123',
            cartItems: createCombinedCartItems()
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(NO_PRICE_AMOUNT)
    })

    // 作成失敗(shippingRateId が null)
    it('should return error when shipping rate ID is null', async () => {
        const stripe = await getMockStripe()
    
        vi.stubEnv('STRIPE_SHIPPING_FREE_RATE_ID', undefined)
        vi.stubEnv('STRIPE_SHIPPING_REGULAR_RATE_ID', undefined)
    
        vi.mocked(getUser).mockResolvedValue(mockUser)
    
        vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
            ...mockAddedCheckoutSession
        })
        
        vi.mocked(stripe.prices.retrieve).mockResolvedValue({
            ...mockPrice,
            unit_amount: 1000
        })
    
        const result = await processCheckoutItems({
            userId: 'user_test_123',
            cartItems: createCombinedCartItems()
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(NO_SHIPPING_RATE_ID)

        vi.stubEnv('STRIPE_SHIPPING_FREE_RATE_ID', 'shr_free_test_123')
        vi.stubEnv('STRIPE_SHIPPING_REGULAR_RATE_ID', 'shr_regular_test_123')
    })

    // 作成失敗(配送料の取得失敗)
    it('should return error when shipping rate retrieval fails', async () => {
        const stripe = await getMockStripe()

        vi.mocked(getUser).mockResolvedValue(mockUser)
    
        vi.mocked(stripe.prices.retrieve).mockResolvedValue({
            ...mockPrice,
            unit_amount: 1000
        })
    
        vi.mocked(stripe.shippingRates.retrieve).mockRejectedValue(
            new Error('Stripe API Error')
        )
    
        const result = await processCheckoutItems({
            userId: 'user_test_123',
            cartItems: createCombinedCartItems()
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(NO_SHIPPING_RATE_AMOUNT)
    })

    // 作成失敗(チェックアウトセッションの作成失敗)
    it('should return error when checkout session creation fails', async () => {
        const stripe = await getMockStripe()

        vi.mocked(getUser).mockResolvedValue(mockUser)
    
        vi.mocked(stripe.checkout.sessions.create).mockRejectedValue(
            new Error('Stripe API Error')
        )
        
        vi.mocked(stripe.prices.retrieve).mockResolvedValue({
            ...mockPrice,
            unit_amount: 1000
        })
    
        vi.mocked(stripe.shippingRates.retrieve).mockResolvedValue({
            ...mockShippingRate
        })
    
        const result = await processCheckoutItems({
            userId: 'user_test_123',
            cartItems: createCombinedCartItems()
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(CHECKOUT_SESSION_FAILED)
    })

    // 作成失敗(合計金額が一致しない)
    it('should return error when amount total mismatch', async () => {
        const stripe = await getMockStripe()

        vi.mocked(getUser).mockResolvedValue(mockUser)
    
        vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
            ...mockAddedCheckoutSession,
            amount_total: 5000 // 合計金額が一致しない
        })
        
        vi.mocked(stripe.prices.retrieve).mockResolvedValue({
            ...mockPrice,
            unit_amount: 1000
        })
    
        vi.mocked(stripe.shippingRates.retrieve).mockResolvedValue({
            ...mockShippingRate
        })
    
        const result = await processCheckoutItems({
            userId: 'user_test_123',
            cartItems: createCombinedCartItems()
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(AMOUNT_TOTAL_MISMATCH)
    })

    // 取得失敗（userId が null）
    it('should return error when userId is null', async () => {
        const stripe = await getMockStripe()
    
        vi.mocked(getUser).mockResolvedValue(mockUser)
    
        const result = await processCheckoutItems({
            userId: null as unknown as UserId,
            cartItems: createCombinedCartItems()
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(CHECKOUT_SESSION_FAILED)
    })

    // 作成失敗（cartItems が空配列）
    it('should return error when cartItems is empty', async () => {
        const stripe = await getMockStripe()
    
        vi.mocked(getUser).mockResolvedValue(mockUser)
    
        const result = await processCheckoutItems({
            userId: 'user_test_123',
            cartItems: []
        })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(CHECKOUT_SESSION_FAILED)
    })
})

/* ==================================== 
    Process Checkout Session Completed Test
==================================== */
describe('processCheckoutSessionCompleted', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should process checkout session completed successfully', async () => {
        vi.mocked(processOrderData).mockResolvedValue({
            orderData: mockOrderData,
            productDetailsData: createCombinedProductDetails()
        })

        vi.mocked(updateProductStockAndSoldCount).mockResolvedValue({
            success: true,
            error: null
        })

        vi.mocked(processShippingAddress).mockResolvedValue()

        vi.mocked(sendOrderCompleteEmail).mockResolvedValue({
            success: true,
            error: null
        })

        vi.mocked(sendOrderEmails).mockResolvedValue()
        vi.mocked(deactivatePaymentLink).mockResolvedValue({
            success: true,
            error: null
        })

        const result = await processCheckoutSessionCompleted({
            checkoutSessionEvent: {
                ...mockCheckoutSession,
                mode: 'payment'
            }
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 作成失敗(注文テータの処理失敗)
    it('should return error when order data process fails', async () => {
        vi.mocked(processOrderData).mockRejectedValue(
            new Error('Order Data Process Error')
        )

        const result = await processCheckoutSessionCompleted({
            checkoutSessionEvent: {
                ...mockCheckoutSession,
                mode: 'payment'
            }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe('Order Data Process Error')
    })

    // 作成失敗(注文データ無し)
    it('should return error when order data is not found', async () => {
        vi.mocked(processOrderData).mockResolvedValue({
            orderData: null as unknown as CreateCheckoutOrderData,
            productDetailsData: []
        })
        
        const result = await processCheckoutSessionCompleted({
            checkoutSessionEvent: {
                ...mockCheckoutSession,
                mode: 'payment'
            }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(ORDER_DATA_PROCESS_FAILED)
    })

    // 作成失敗(在庫数と売り上げ数の更新失敗)
    it('should return error when stock and sold count update fails', async () => {
        vi.mocked(processOrderData).mockResolvedValue({
            orderData: mockOrderData,
            productDetailsData: createCombinedProductDetails()
        })

        vi.mocked(updateProductStockAndSoldCount).mockResolvedValue({
            success: false,
            error: UPDATE_STOCK_AND_SOLD_COUNT_FAILED
        })

        const result = await processCheckoutSessionCompleted({
            checkoutSessionEvent: {
                ...mockCheckoutSession,
                mode: 'payment'
            }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(UPDATE_STOCK_AND_SOLD_COUNT_FAILED)
    })

    // 作成失敗(配送先住所のデータ保存失敗)
    it('should return error when shipping address data save fails', async () => {
        vi.mocked(processOrderData).mockResolvedValue({
            orderData: mockOrderData,
            productDetailsData: createCombinedProductDetails()
        })

        vi.mocked(updateProductStockAndSoldCount).mockResolvedValue({
            success: true,
            error: null
        })

        vi.mocked(processShippingAddress).mockRejectedValue(
            new Error('Shipping Address Error')
        )

        const result = await processCheckoutSessionCompleted({
            checkoutSessionEvent: {
                ...mockCheckoutSession,
                mode: 'payment'
            }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe('Shipping Address Error')
    })

    // 作成失敗(注文完了メールの送信失敗)
    it('should return error when order complete email send fails', async () => {
        vi.mocked(processOrderData).mockResolvedValue({
            orderData: mockOrderData,
            productDetailsData: createCombinedProductDetails()
        })

        vi.mocked(updateProductStockAndSoldCount).mockResolvedValue({
            success: true,
            error: null
        })

        vi.mocked(processShippingAddress).mockResolvedValue()

        vi.mocked(sendOrderCompleteEmail).mockResolvedValue({
            success: false,
            error: ORDER_SEND_FAILED
        })

        const result = await processCheckoutSessionCompleted({
            checkoutSessionEvent: {
                ...mockCheckoutSession,
                mode: 'payment'
            }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(ORDER_SEND_FAILED)
    })

    // 作成失敗(未払いの場合のメール送信失敗)
    it('should return error when unpaid email send fails', async () => {
        vi.mocked(processOrderData).mockResolvedValue({
            orderData: mockOrderData,
            productDetailsData: createCombinedProductDetails()
        })

        vi.mocked(updateProductStockAndSoldCount).mockResolvedValue({
            success: true,
            error: null
        })

        vi.mocked(processShippingAddress).mockResolvedValue()

        vi.mocked(sendOrderCompleteEmail).mockResolvedValue({
            success: true,
            error: null
        })

        vi.mocked(sendOrderEmails).mockRejectedValue(
            new Error('Email Error')
        )

        const result = await processCheckoutSessionCompleted({
            checkoutSessionEvent: {
                ...mockCheckoutSession,
                mode: 'payment',
                payment_status: 'unpaid'
            }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe('Email Error')
    })

    // 作成失敗(Payment Link の無効化失敗)
    it('should return error when payment link deactivate fails', async () => {
        vi.mocked(processOrderData).mockResolvedValue({
            orderData: mockOrderData,
            productDetailsData: createCombinedProductDetails()
        })

        vi.mocked(updateProductStockAndSoldCount).mockResolvedValue({
            success: true,
            error: null
        })

        vi.mocked(processShippingAddress).mockResolvedValue()

        vi.mocked(sendOrderCompleteEmail).mockResolvedValue({
            success: true,
            error: null
        })

        vi.mocked(sendOrderEmails).mockResolvedValue()
        vi.mocked(deactivatePaymentLink).mockResolvedValue({
            success: false,
            error: PAYMENT_LINK_DEACTIVATE_FAILED
        })

        const result = await processCheckoutSessionCompleted({
            checkoutSessionEvent: {
                ...mockCheckoutSession,
                mode: 'payment',
                payment_link: 'plink_test_123'
            }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(PAYMENT_LINK_DEACTIVATE_FAILED)
    })

    // 作成失敗(payment_link が null)
    it('should return error when payment link is null', async () => {
        vi.mocked(processOrderData).mockResolvedValue({
            orderData: mockOrderData,
            productDetailsData: createCombinedProductDetails()
        })

        vi.mocked(updateProductStockAndSoldCount).mockResolvedValue({
            success: true,
            error: null
        })

        vi.mocked(processShippingAddress).mockResolvedValue()

        vi.mocked(sendOrderCompleteEmail).mockResolvedValue({
            success: true,
            error: null
        })

        vi.mocked(sendOrderEmails).mockResolvedValue()
        vi.mocked(deactivatePaymentLink).mockResolvedValue({
            success: true,
            error: null
        })

        const result = await processCheckoutSessionCompleted({
            checkoutSessionEvent: {
                ...mockCheckoutSession,
                mode: 'payment',
                payment_link: null
            }
        })

        expect(result.success).toBe(true)
        expect(deactivatePaymentLink).not.toHaveBeenCalled()
    })

    // Subsctiptionの場合
    it('should return error when subscription is true', async () => {
        vi.mocked(processOrderData).mockResolvedValue({
            orderData: mockOrderData,
            productDetailsData: createCombinedProductDetails()
        })

        vi.mocked(updateProductStockAndSoldCount).mockResolvedValue({
            success: true,
            error: null
        })

        vi.mocked(processShippingAddress).mockResolvedValue()

        vi.mocked(sendOrderCompleteEmail).mockResolvedValue({
            success: true,
            error: null
        })

        const result = await processCheckoutSessionCompleted({
            checkoutSessionEvent: {
                ...mockCheckoutSession,
                mode: 'subscription',
                subscription: 'sub_test_123'
            }
        })

        expect(result.success).toBe(true)
        expect(sendOrderEmails).not.toHaveBeenCalled()
        expect(deactivatePaymentLink).not.toHaveBeenCalled()
    })

    // payment_status が 'paid' でない場合
    it('should process checkout session completed successfully', async () => {
        vi.mocked(processOrderData).mockResolvedValue({
            orderData: mockOrderData,
            productDetailsData: createCombinedProductDetails()
        })

        vi.mocked(updateProductStockAndSoldCount).mockResolvedValue({
            success: true,
            error: null
        })

        vi.mocked(processShippingAddress).mockResolvedValue()

        vi.mocked(sendOrderCompleteEmail).mockResolvedValue({
            success: true,
            error: null
        })

        vi.mocked(sendOrderEmails).mockResolvedValue()
        vi.mocked(deactivatePaymentLink).mockResolvedValue({
            success: true,
            error: null
        })

        const result = await processCheckoutSessionCompleted({
            checkoutSessionEvent: {
                ...mockCheckoutSession,
                mode: 'payment',
                payment_status: 'unpaid',
                payment_link: 'plink_test_123'
            }
        })

        expect(result.success).toBe(true)
        expect(sendOrderEmails).toHaveBeenCalled()
    })

    // checkoutSessionEvent.metadata.userID が null の場合
    it('should return error when user ID is null', async () => {
        vi.mocked(processOrderData).mockResolvedValue({
            orderData: mockOrderData,
            productDetailsData: createCombinedProductDetails()
        })

        vi.mocked(updateProductStockAndSoldCount).mockResolvedValue({
            success: true,
            error: null
        })

        vi.mocked(processShippingAddress).mockRejectedValue(
            new Error(SHIPPING_ADDRESS_ERROR.NO_USER_ID)
        )

        vi.mocked(sendOrderCompleteEmail).mockResolvedValue({
            success: true,
            error: null
        })

        vi.mocked(sendOrderEmails).mockResolvedValue()
        vi.mocked(deactivatePaymentLink).mockResolvedValue({
            success: true,
            error: null
        })

        const result = await processCheckoutSessionCompleted({
            checkoutSessionEvent: {
                ...mockCheckoutSession,
                mode: 'payment',
                metadata: {
                    userID: null as unknown as UserId
                }
            }
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(SHIPPING_ADDRESS_ERROR.NO_USER_ID)
    })
})