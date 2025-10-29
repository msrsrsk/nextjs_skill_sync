import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { sendSubscriptionPaymentRequestEmail } from "@/services/email/subscription/subscription-payment-request"
import { subscriptionPaymentRequestEmailTemplate } from "@/lib/templates/email/subscription"
import { formatOrderDateTime } from "@/services/order/format"
import { formatNumber } from "@/lib/utils/format"
import { ERROR_MESSAGES } from "@/constants/errorMessages"
import { DATE_FORMAT_TYPES, SITE_MAP } from "@/constants/index"
import { mockSubscription, mockSubscriptionItems } from "@/__tests__/mocks/stripe-mocks"
import { mockSubscriptionProductDetails } from "@/__tests__/mocks/domain-mocks"

const { DATE_SLASH } = DATE_FORMAT_TYPES;
const { SUBSCRIPTION_HISTORY_PATH } = SITE_MAP;
const { EMAIL_ERROR } = ERROR_MESSAGES;

const { SUBSCRIPTION_PAYMENT_REQUEST_SEND_FAILED } = EMAIL_ERROR;

const mockResendSend = vi.fn()
const mockResend = {
    emails: {
        send: mockResendSend
    }
}

vi.mock('resend', () => ({
    Resend: vi.fn().mockImplementation(() => mockResend)
}))

vi.mock('@/lib/templates/email/subscription', () => ({
    subscriptionPaymentRequestEmailTemplate: vi.fn()
}))

vi.mock('@/services/order/format', () => ({
    formatOrderDateTime: vi.fn()
}))

vi.mock('@/lib/utils/format', () => ({
    formatNumber: vi.fn()
}))

/* ==================================== 
    sendSubscriptionPaymentRequestEmail Test
==================================== */
describe('sendSubscriptionPaymentRequestEmail', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        vi.stubEnv('RESEND_CHECKOUT_API_KEY', 'test-api-key')
        vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.com')
    })

    afterEach(() => {
        vi.unstubAllEnvs()
    })

    const mockOrderData = {
        ...mockSubscription,
        metadata: {
            userEmail: 'test@example.com',
            subscription_shipping_fee: '500'
        },
        items: {
            ...mockSubscription.items,
            data: mockSubscriptionItems
        }
    }

    // 送信成功
    it('should send subscription payment request email successfully', async () => {
        const mockHtml = '<html>Subscription payment request email template</html>'
        const mockFormattedDate = '2024/01/01 09:00'
        const mockFormattedShippingFee = '500'
        const mockFormattedSubtotal = '2,000'
        const mockFormattedTotal = '2,000'

        vi.mocked(subscriptionPaymentRequestEmailTemplate).mockReturnValue(mockHtml)
        vi.mocked(formatOrderDateTime).mockReturnValue(mockFormattedDate)
        vi.mocked(formatNumber).mockImplementation((num: number) => {
            if (num === 500) return mockFormattedShippingFee
            if (num === 2000) return mockFormattedSubtotal
            return String(num)
        })
        mockResendSend.mockResolvedValue({ id: 'email-123' })

        const result = await sendSubscriptionPaymentRequestEmail({
            orderData: mockOrderData,
            productDetails: mockSubscriptionProductDetails
        })

        expect(result).toEqual({
            success: true,
            error: null
        })
        
        expect(formatOrderDateTime).toHaveBeenCalledWith(
            mockOrderData.created,
            DATE_SLASH
        )
        expect(formatNumber).toHaveBeenCalledWith(500) // shippingFee
        expect(formatNumber).toHaveBeenCalledWith(2000) // subtotal
        expect(formatNumber).toHaveBeenCalledWith(2000) // total
        
        expect(subscriptionPaymentRequestEmailTemplate).toHaveBeenCalledWith({
            subscriptionHistoryUrl: `https://example.com${SUBSCRIPTION_HISTORY_PATH}`,
            subscriptionId: mockOrderData.id,
            formattedOrderDate: mockFormattedDate,
            productDetails: mockSubscriptionProductDetails,
            shippingFee: mockFormattedShippingFee,
            subtotal: mockFormattedSubtotal,
            total: mockFormattedTotal,
            createdAt: mockOrderData.created
        })
        
        expect(mockResendSend).toHaveBeenCalledWith({
            from: 'notification@skill-sync.site',
            to: [mockOrderData.metadata?.userEmail],
            subject: '【Skill Sync】サブスクリプションのお支払いのお願い',
            html: mockHtml
        })
    })

    // 送信失敗（orderData が null）
    it('should return error when orderData is null', async () => {
        const result = await sendSubscriptionPaymentRequestEmail({
            orderData: null as unknown as StripeSubscription,
            productDetails: mockSubscriptionProductDetails
        })

        expect(result).toEqual({
            success: false,
            error: SUBSCRIPTION_PAYMENT_REQUEST_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（productDetails が null）
    it('should return error when productDetails is null', async () => {
        const result = await sendSubscriptionPaymentRequestEmail({
            orderData: mockOrderData,
            productDetails: null as unknown as StripeProductDetailsProps[]
        })

        expect(result).toEqual({
            success: false,
            error: SUBSCRIPTION_PAYMENT_REQUEST_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（Resend 送信エラー）
    it('should handle Resend send error', async () => {
        vi.mocked(subscriptionPaymentRequestEmailTemplate).mockReturnValue('<html>Template</html>')
        vi.mocked(formatOrderDateTime).mockReturnValue('2024/01/01 09:00')
        vi.mocked(formatNumber).mockReturnValue('1,000')

        mockResendSend.mockRejectedValue(new Error('Resend API error'))

        const result = await sendSubscriptionPaymentRequestEmail({
            orderData: mockOrderData,
            productDetails: mockSubscriptionProductDetails
        })

        expect(result).toEqual({
            success: false,
            error: SUBSCRIPTION_PAYMENT_REQUEST_SEND_FAILED
        })
    })

    // 送信成功（メタデータが空の場合）
    it('should handle empty metadata gracefully', async () => {
        const orderDataWithEmptyMetadata = {
            ...mockOrderData,
            metadata: {},
            items: {
                ...mockOrderData.items,
                data: [
                    {
                        ...mockOrderData.items.data[0],
                        price: {
                            ...mockOrderData.items.data[0].price!,
                            unit_amount: 0
                        }
                    }
                ]
            }
        }

        const mockHtml = '<html>Template</html>'
        vi.mocked(subscriptionPaymentRequestEmailTemplate).mockReturnValue(mockHtml)
        vi.mocked(formatOrderDateTime).mockReturnValue('2024/01/01 09:00')
        vi.mocked(formatNumber).mockReturnValue('0')
        mockResendSend.mockResolvedValue({ id: 'email-123' })

        const result = await sendSubscriptionPaymentRequestEmail({
            orderData: orderDataWithEmptyMetadata,
            productDetails: mockSubscriptionProductDetails
        })

        expect(result).toEqual({
            success: false,
            error: SUBSCRIPTION_PAYMENT_REQUEST_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（Email が空の場合）
    it('should handle missing userEmail in metadata', async () => {
        const orderDataWithMissingEmail = {
            ...mockOrderData,
            metadata: {
                subscription_shipping_fee: '500'
            }
        }
    
        const mockHtml = '<html>Template</html>'
        vi.mocked(subscriptionPaymentRequestEmailTemplate).mockReturnValue(mockHtml)
        vi.mocked(formatOrderDateTime).mockReturnValue('2024/01/01 09:00')
        vi.mocked(formatNumber).mockReturnValue('2,000')
        mockResendSend.mockResolvedValue({ id: 'email-123' })
    
        const result = await sendSubscriptionPaymentRequestEmail({
            orderData: orderDataWithMissingEmail,
            productDetails: mockSubscriptionProductDetails
        })
    
        expect(result).toEqual({
            success: false,
            error: SUBSCRIPTION_PAYMENT_REQUEST_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（テンプレート内でエラー）
    it('should handle template function error', async () => {
        vi.mocked(subscriptionPaymentRequestEmailTemplate).mockImplementation(() => {
            throw new Error('Template error')
        })
        vi.mocked(formatOrderDateTime).mockReturnValue('2024/01/01 09:00')
        vi.mocked(formatNumber).mockReturnValue('2,000')
    
        const result = await sendSubscriptionPaymentRequestEmail({
            orderData: mockOrderData,
            productDetails: mockSubscriptionProductDetails
        })
    
        expect(result).toEqual({
            success: false,
            error: SUBSCRIPTION_PAYMENT_REQUEST_SEND_FAILED
        })
    })
})