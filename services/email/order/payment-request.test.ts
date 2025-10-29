import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { sendPaymentRequestEmail } from "@/services/email/order/payment-request"
import { paymentRequestEmailTemplate } from "@/lib/templates/email/order"
import { formatOrderDateTime } from "@/services/order/format"
import { formatNumber } from "@/lib/utils/format"
import { ERROR_MESSAGES } from "@/constants/errorMessages"
import { DATE_FORMAT_TYPES, SITE_MAP } from "@/constants/index"
import { mockOrderDataWithCustomerDetails, mockPaymentIntent, mockCheckoutSession, mockCustomerDetails } from "@/__tests__/mocks/stripe-mocks"
import { mockProductDetails } from "@/__tests__/mocks/domain-mocks"

const { DATE_SLASH } = DATE_FORMAT_TYPES;
const { ORDER_HISTORY_PATH } = SITE_MAP;
const { EMAIL_ERROR } = ERROR_MESSAGES;

const { PAYMENT_REQUEST_SEND_FAILED } = EMAIL_ERROR;

const mockResendSend = vi.fn()
const mockResend = {
    emails: {
        send: mockResendSend
    }
}

vi.mock('resend', () => ({
    Resend: vi.fn().mockImplementation(() => mockResend)
}))

vi.mock('@/lib/templates/email/order', () => ({
    paymentRequestEmailTemplate: vi.fn()
}))

vi.mock('@/services/order/format', () => ({
    formatOrderDateTime: vi.fn()
}))

vi.mock('@/lib/utils/format', () => ({
    formatNumber: vi.fn()
}))

/* ==================================== 
    sendPaymentRequestEmail Test
==================================== */
describe('sendPaymentRequestEmail', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        vi.stubEnv('RESEND_CHECKOUT_API_KEY', 'test-api-key')
        vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.com')
    })

    afterEach(() => {
        vi.unstubAllEnvs()
    })

    const mockOrderNumber = 12345

    // 送信成功
    it('should send payment request email successfully', async () => {
        const mockHtml = '<html>Payment request email template</html>'
        const mockFormattedDate = '2024/01/01 09:00'
        const mockFormattedShippingFee = '500'
        const mockFormattedSubtotal = '2,000'
        const mockFormattedTotal = '2,500'

        vi.mocked(paymentRequestEmailTemplate).mockReturnValue(mockHtml)
        vi.mocked(formatOrderDateTime).mockReturnValue(mockFormattedDate)
        vi.mocked(formatNumber).mockImplementation((num: number) => {
            if (num === 500) return mockFormattedShippingFee
            if (num === 2000) return mockFormattedSubtotal
            if (num === 2500) return mockFormattedTotal
            return String(num)
        })
        mockResendSend.mockResolvedValue({ id: 'email-123' })

        const result = await sendPaymentRequestEmail({
            orderData: mockOrderDataWithCustomerDetails,
            productDetails: mockProductDetails,
            orderNumber: mockOrderNumber,
            paymentIntent: mockPaymentIntent,
            checkoutSessionEvent: mockCheckoutSession
        })

        expect(result).toEqual({
            success: true,
            error: null
        })
        
        expect(formatOrderDateTime).toHaveBeenCalledWith(
            mockOrderDataWithCustomerDetails.created,
            DATE_SLASH
        )
        expect(formatNumber).toHaveBeenCalledWith(500) // shippingFee
        expect(formatNumber).toHaveBeenCalledWith(2000) // subtotal
        expect(formatNumber).toHaveBeenCalledWith(2500) // total
        
        expect(paymentRequestEmailTemplate).toHaveBeenCalledWith({
            paymentIntent: mockPaymentIntent,
            orderHistoryUrl: `https://example.com${ORDER_HISTORY_PATH}`,
            orderNumber: mockOrderNumber,
            formattedOrderDate: mockFormattedDate,
            productDetails: mockProductDetails,
            subtotal: mockFormattedSubtotal,
            shippingFee: mockFormattedShippingFee,
            total: mockFormattedTotal,
            errorType: 'unknown',
            checkoutSessionEvent: mockCheckoutSession
        })
        
        expect(mockResendSend).toHaveBeenCalledWith({
            from: 'notification@skill-sync.site',
            to: ['test@example.com'],
            subject: '【Skill Sync】お支払いのお願い',
            html: mockHtml
        })
    })

    // 送信失敗（orderData が null）
    it('should return error when orderData is null', async () => {
        const result = await sendPaymentRequestEmail({
            orderData: null as unknown as StripeCheckoutSession,
            productDetails: mockProductDetails,
            orderNumber: mockOrderNumber,
            paymentIntent: mockPaymentIntent,
            checkoutSessionEvent: mockCheckoutSession
        })

        expect(result).toEqual({
            success: false,
            error: PAYMENT_REQUEST_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（productDetails が null）
    it('should return error when productDetails is null', async () => {
        const result = await sendPaymentRequestEmail({
            orderData: mockOrderDataWithCustomerDetails,
            productDetails: null as unknown as StripeProductDetailsProps[],
            orderNumber: mockOrderNumber,
            paymentIntent: mockPaymentIntent,
            checkoutSessionEvent: mockCheckoutSession
        })

        expect(result).toEqual({
            success: false,
            error: PAYMENT_REQUEST_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（orderNumber が null）
    it('should return error when orderNumber is null', async () => {
        const result = await sendPaymentRequestEmail({
            orderData: mockOrderDataWithCustomerDetails,
            productDetails: mockProductDetails,
            orderNumber: null as unknown as OrderNumber,
            paymentIntent: mockPaymentIntent,
            checkoutSessionEvent: mockCheckoutSession
        })

        expect(result).toEqual({
            success: false,
            error: PAYMENT_REQUEST_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（email が null）
    it('should return error when customer email is null', async () => {
        const orderDataWithoutEmail = {
            ...mockOrderDataWithCustomerDetails,
            customer_details: {
                ...mockCustomerDetails,
                email: null as unknown as UserEmail
            }
        }

        const result = await sendPaymentRequestEmail({
            orderData: orderDataWithoutEmail,
            productDetails: mockProductDetails,
            orderNumber: mockOrderNumber,
            paymentIntent: mockPaymentIntent,
            checkoutSessionEvent: mockCheckoutSession
        })

        expect(result).toEqual({
            success: false,
            error: PAYMENT_REQUEST_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（Resend 送信エラー）
    it('should handle Resend send error', async () => {
        vi.mocked(paymentRequestEmailTemplate).mockReturnValue('<html>Template</html>')
        vi.mocked(formatOrderDateTime).mockReturnValue('2024/01/01 09:00')
        vi.mocked(formatNumber).mockReturnValue('2,500')

        mockResendSend.mockRejectedValue(new Error('Resend API error'))

        const result = await sendPaymentRequestEmail({
            orderData: mockOrderDataWithCustomerDetails,
            productDetails: mockProductDetails,
            orderNumber: mockOrderNumber,
            paymentIntent: mockPaymentIntent,
            checkoutSessionEvent: mockCheckoutSession
        })

        expect(result).toEqual({
            success: false,
            error: PAYMENT_REQUEST_SEND_FAILED
        })
    })

    // 送信失敗（テンプレート関数内でエラー）
    it('should handle template function error', async () => {
        vi.mocked(paymentRequestEmailTemplate).mockImplementation(() => {
            throw new Error('Template error')
        })
        vi.mocked(formatOrderDateTime).mockReturnValue('2024/01/01 09:00')
        vi.mocked(formatNumber).mockReturnValue('2,500')

        const result = await sendPaymentRequestEmail({
            orderData: mockOrderDataWithCustomerDetails,
            productDetails: mockProductDetails,
            orderNumber: mockOrderNumber,
            paymentIntent: mockPaymentIntent,
            checkoutSessionEvent: mockCheckoutSession
        })

        expect(result).toEqual({
            success: false,
            error: PAYMENT_REQUEST_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })
})