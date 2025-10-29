import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { sendOrderCompleteEmail } from "@/services/email/order/confirmation"
import { orderCompleteEmailTemplate } from "@/lib/templates/email/order"
import { getShippingRateAmount } from "@/services/stripe/actions"
import { formatNumber } from "@/lib/utils/format"
import { formatOrderDateTime, formatPaymentMethodType } from "@/services/order/format"
import { ERROR_MESSAGES } from "@/constants/errorMessages"
import { DATE_FORMAT_TYPES, SITE_MAP } from "@/constants/index"
import { mockOrderDataWithCustomerDetails } from "@/__tests__/mocks/stripe-mocks"
import { mockProductDetails } from "@/__tests__/mocks/domain-mocks"

const { DATE_SLASH } = DATE_FORMAT_TYPES;
const { ORDER_HISTORY_PATH } = SITE_MAP;
const { EMAIL_ERROR } = ERROR_MESSAGES;

const { ORDER_SEND_FAILED } = EMAIL_ERROR;

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
    orderCompleteEmailTemplate: vi.fn()
}))

vi.mock('@/services/stripe/actions', () => ({
    getShippingRateAmount: vi.fn()
}))

vi.mock('@/lib/utils/format', () => ({
    formatNumber: vi.fn()
}))

vi.mock('@/services/order/format', () => ({
    formatOrderDateTime: vi.fn(),
    formatPaymentMethodType: vi.fn()
}))

/* ==================================== 
    sendOrderCompleteEmail Test
==================================== */
describe('sendOrderCompleteEmail', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        vi.stubEnv('RESEND_CHECKOUT_API_KEY', 'test-api-key')
        vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.com')
        vi.stubEnv('STRIPE_SHIPPING_REGULAR_RATE_ID', 'shr_test_123')
    })

    afterEach(() => {
        vi.unstubAllEnvs()
    })

    const mockOrderNumber = 12345

    // 送信成功（通常商品の場合）
    it('should send order complete email successfully for payment mode', async () => {
        const mockHtml = '<html>Order complete email template</html>'
        const mockFormattedDate = '2024/01/01 09:00'
        const mockFormattedShippingFee = '500'
        const mockFormattedSubtotal = '2,000'
        const mockFormattedTotal = '2,500'
        const mockCardType = 'Visa'

        vi.mocked(getShippingRateAmount).mockResolvedValue({
            success: true,
            data: 500
        })

        vi.mocked(orderCompleteEmailTemplate).mockReturnValue(mockHtml)
        vi.mocked(formatOrderDateTime).mockReturnValue(mockFormattedDate)
        vi.mocked(formatPaymentMethodType).mockReturnValue(mockCardType)
        vi.mocked(formatNumber).mockImplementation((num: number) => {
            if (num === 500) return mockFormattedShippingFee
            if (num === 2000) return mockFormattedSubtotal
            if (num === 2500) return mockFormattedTotal
            return String(num)
        })
        mockResendSend.mockResolvedValue({ id: 'email-123' })

        const result = await sendOrderCompleteEmail({
            orderData: mockOrderDataWithCustomerDetails,
            productDetails: mockProductDetails,
            orderNumber: mockOrderNumber
        })

        expect(result).toEqual({
            success: true,
            error: null
        })
        
        expect(formatOrderDateTime).toHaveBeenCalledWith(
            mockOrderDataWithCustomerDetails.created,
            DATE_SLASH
        )
        expect(formatPaymentMethodType).toHaveBeenCalledWith('card')
        expect(formatNumber).toHaveBeenCalledWith(500) // shippingFee
        expect(formatNumber).toHaveBeenCalledWith(2000) // subtotal
        expect(formatNumber).toHaveBeenCalledWith(2500) // total
        
        expect(orderCompleteEmailTemplate).toHaveBeenCalledWith({
            productDetails: mockProductDetails,
            orderNumber: mockOrderNumber,
            name: 'Test User',
            orderHistoryUrl: `https://example.com${ORDER_HISTORY_PATH}`,
            formattedOrderDate: mockFormattedDate,
            shippingDetails: mockOrderDataWithCustomerDetails.customer_details?.address,
            shippingFee: mockFormattedShippingFee,
            subtotal: mockFormattedSubtotal,
            total: mockFormattedTotal,
            cardType: mockCardType,
            paid: true
        })
        
        expect(mockResendSend).toHaveBeenCalledWith({
            from: 'notification@skill-sync.site',
            to: ['test@example.com'],
            subject: '【Skill Sync】ご注文いただきありがとうございます',
            html: mockHtml
        })
    })

    // 送信成功（サブスクリプション商品の場合）
    it('should send order complete email successfully for subscription mode', async () => {
        const subscriptionOrderData = {
            ...mockOrderDataWithCustomerDetails,
            mode: 'subscription' as const,
            amount_subtotal: 3000
        }

        vi.mocked(getShippingRateAmount).mockResolvedValue({
            success: true,
            data: 800
        })

        const mockHtml = '<html>Subscription order email template</html>'
        vi.mocked(orderCompleteEmailTemplate).mockReturnValue(mockHtml)
        vi.mocked(formatOrderDateTime).mockReturnValue('2024/01/01 09:00')
        vi.mocked(formatPaymentMethodType).mockReturnValue('Visa')
        vi.mocked(formatNumber).mockReturnValue('2,200') // subtotal after shipping deduction
        mockResendSend.mockResolvedValue({ id: 'email-456' })

        const result = await sendOrderCompleteEmail({
            orderData: subscriptionOrderData,
            productDetails: mockProductDetails,
            orderNumber: mockOrderNumber
        })

        expect(result).toEqual({
            success: true,
            error: null
        })
        
        expect(getShippingRateAmount).toHaveBeenCalledWith('shr_test_123')
        expect(formatNumber).toHaveBeenCalledWith(2200) // 3000 - 800
    })

    // 送信失敗（orderData が null）
    it('should return error when orderData is null', async () => {
        const result = await sendOrderCompleteEmail({
            orderData: null as unknown as StripeCheckoutSession,
            productDetails: mockProductDetails,
            orderNumber: mockOrderNumber
        })

        expect(result).toEqual({
            success: false,
            error: ORDER_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（productDetails が null）
    it('should return error when productDetails is null', async () => {
        const result = await sendOrderCompleteEmail({
            orderData: mockOrderDataWithCustomerDetails,
            productDetails: null as unknown as StripeProductDetailsProps[],
            orderNumber: mockOrderNumber
        })

        expect(result).toEqual({
            success: false,
            error: ORDER_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（orderNumber が null）
    it('should return error when orderNumber is null', async () => {
        const result = await sendOrderCompleteEmail({
            orderData: mockOrderDataWithCustomerDetails,
            productDetails: mockProductDetails,
            orderNumber: null as unknown as OrderNumber
        })

        expect(result).toEqual({
            success: false,
            error: ORDER_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（getShippingRateAmount が失敗した場合）
    it('should return error when getShippingRateAmount is failure', async () => {
        vi.mocked(getShippingRateAmount).mockResolvedValue({
            success: false,
            data: 0
        })

        const mockHtml = '<html>Order complete email template</html>'
        vi.mocked(orderCompleteEmailTemplate).mockReturnValue(mockHtml)
        vi.mocked(formatOrderDateTime).mockReturnValue('2024/01/01 09:00')
        vi.mocked(formatPaymentMethodType).mockReturnValue('Visa')
        vi.mocked(formatNumber).mockReturnValue('2,200')
        mockResendSend.mockResolvedValue({ id: 'email-456' })

        const result = await sendOrderCompleteEmail({
            orderData: mockOrderDataWithCustomerDetails,
            productDetails: mockProductDetails,
            orderNumber: mockOrderNumber
        })

        expect(result).toEqual({
            success: false,
            error: ORDER_SEND_FAILED
        })
    })

    // 送信失敗（Resend 送信エラー）
    it('should handle Resend send error', async () => {
        vi.mocked(orderCompleteEmailTemplate).mockReturnValue('<html>Template</html>')
        vi.mocked(formatOrderDateTime).mockReturnValue('2024/01/01 09:00')
        vi.mocked(formatPaymentMethodType).mockReturnValue('Visa')
        vi.mocked(formatNumber).mockReturnValue('2,500')

        mockResendSend.mockRejectedValue(new Error('Resend API error'))

        const result = await sendOrderCompleteEmail({
            orderData: mockOrderDataWithCustomerDetails,
            productDetails: mockProductDetails,
            orderNumber: mockOrderNumber
        })

        expect(result).toEqual({
            success: false,
            error: ORDER_SEND_FAILED
        })
    })

    // 送信失敗（Email が空の場合）
    it('should handle missing customer_details', async () => {
        const orderDataWithoutCustomer = {
            ...mockOrderDataWithCustomerDetails,
            customer_details: null
        }

        const mockHtml = '<html>Template</html>'
        vi.mocked(orderCompleteEmailTemplate).mockReturnValue(mockHtml)
        vi.mocked(formatOrderDateTime).mockReturnValue('2024/01/01 09:00')
        vi.mocked(formatPaymentMethodType).mockReturnValue('Visa')
        vi.mocked(formatNumber).mockReturnValue('2,500')
        mockResendSend.mockResolvedValue({ id: 'email-123' })

        const result = await sendOrderCompleteEmail({
            orderData: orderDataWithoutCustomer,
            productDetails: mockProductDetails,
            orderNumber: mockOrderNumber
        })

        expect(result).toEqual({
            success: false,
            error: ORDER_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（テンプレート内でエラー）
    it('should handle template function error', async () => {
        vi.mocked(orderCompleteEmailTemplate).mockImplementation(() => {
            throw new Error('Template error')
        })
        vi.mocked(formatOrderDateTime).mockReturnValue('2024/01/01 09:00')
        vi.mocked(formatPaymentMethodType).mockReturnValue('Visa')
        vi.mocked(formatNumber).mockReturnValue('2,500')

        const result = await sendOrderCompleteEmail({
            orderData: mockOrderDataWithCustomerDetails,
            productDetails: mockProductDetails,
            orderNumber: mockOrderNumber
        })

        expect(result).toEqual({
            success: false,
            error: ORDER_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（payment_method_types が空配列の場合）
    it('should handle empty payment_method_types', async () => {
        const orderDataWithEmptyPaymentMethods = {
            ...mockOrderDataWithCustomerDetails,
            payment_method_types: []
        }

        const result = await sendOrderCompleteEmail({
            orderData: orderDataWithEmptyPaymentMethods,
            productDetails: mockProductDetails,
            orderNumber: mockOrderNumber
        })

        expect(result).toEqual({
            success: false,
            error: ORDER_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（payment_status が 'unpaid' の場合）
    it('should handle unpaid status', async () => {
        const unpaidOrderData = {
            ...mockOrderDataWithCustomerDetails,
            payment_status: 'unpaid' as const
        }

        vi.mocked(getShippingRateAmount).mockResolvedValue({
            success: true,
            data: 500
        })

        vi.mocked(orderCompleteEmailTemplate).mockReturnValue('<html>Template</html>')
        vi.mocked(formatOrderDateTime).mockReturnValue('2024/01/01 09:00')
        vi.mocked(formatPaymentMethodType).mockReturnValue('Visa')
        vi.mocked(formatNumber).mockReturnValue('2,500')

        const result = await sendOrderCompleteEmail({
            orderData: unpaidOrderData,
            productDetails: mockProductDetails,
            orderNumber: mockOrderNumber
        })

        expect(result).toEqual({
            success: true,
            error: null
        })
        expect(mockResendSend).toHaveBeenCalledWith({
            from: 'notification@skill-sync.site',
            to: ['test@example.com'],
            subject: '【Skill Sync】ご注文いただきありがとうございます',
            html: '<html>Template</html>'
        })
    })
})