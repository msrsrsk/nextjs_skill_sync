import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { receiveStockNotificationEmail } from "@/services/email/notification/stock"
import { stockNotificationEmailTemplate } from "@/lib/templates/email/notification"
import { mockProductNotificationData, mockProduct } from "@/__tests__/mocks/domain-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { EMAIL_ERROR } = ERROR_MESSAGES;

const { STOCK_SEND_FAILED } = EMAIL_ERROR;

const mockResendSend = vi.fn()
const mockResend = {
    emails: {
        send: mockResendSend
    }
}

vi.mock('resend', () => ({
    Resend: vi.fn().mockImplementation(() => mockResend)
}))

vi.mock('@/lib/templates/email/notification', () => ({
    stockNotificationEmailTemplate: vi.fn()
}))

/* ==================================== 
    receiveStockNotificationEmail Test
==================================== */
describe('receiveStockNotificationEmail', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        vi.stubEnv('RESEND_STOCK_NOTIFICATION_API_KEY', 'test-api-key')
        vi.stubEnv('CONTACT_EMAIL', 'contact@example.com')
    })

    afterEach(() => {
        vi.unstubAllEnvs()
    })

    // 送信成功
    it('should send stock notification email successfully', async () => {
        const mockHtml = '<html>Chat notification email template</html>'
        vi.mocked(stockNotificationEmailTemplate).mockReturnValue(mockHtml)
        mockResendSend.mockResolvedValue({ id: 'email-123' })

        const result = await receiveStockNotificationEmail(mockProductNotificationData as NotificationWithDetails)

        expect(result).toEqual({
            success: true,
            error: undefined
        })
        
        expect(stockNotificationEmailTemplate).toHaveBeenCalledWith(
            mockProductNotificationData.relatedData
        )
        
        expect(mockResendSend).toHaveBeenCalledWith({
            from: 'notification@skill-sync.site',
            to: ['contact@example.com'],
            subject: '【Skill Sync】商品在庫の補充必要のご連絡',
            html: mockHtml
        })
    })

    // 送信失敗（record.relatedData が null）
    it('should return error when relatedData is null', async () => {
        const notificationWithNullData = {
            ...mockProductNotificationData,
            relatedData: null
        }

        const result = await receiveStockNotificationEmail(notificationWithNullData as NotificationWithDetails)

        expect(result).toEqual({
            success: false,
            error: STOCK_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（Resend 送信エラー）
    it('should handle Resend send error', async () => {
        vi.mocked(stockNotificationEmailTemplate).mockReturnValue('<html>Template</html>')
        mockResendSend.mockRejectedValue(new Error('Resend API error'))

        const result = await receiveStockNotificationEmail(mockProductNotificationData as NotificationWithDetails)

        expect(result).toEqual({
            success: false,
            error: STOCK_SEND_FAILED
        })
    })

    // 送信失敗（テンプレート関数内でエラー）
    it('should handle template function error', async () => {
        vi.mocked(stockNotificationEmailTemplate).mockImplementation(() => {
            throw new Error('Template error')
        })

        const result = await receiveStockNotificationEmail(mockProductNotificationData as NotificationWithDetails)

        expect(result).toEqual({
            success: false,
            error: STOCK_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（CONTACT_EMAIL が未設定の場合）
    it('should handle missing CONTACT_EMAIL environment variable', async () => {
        vi.stubEnv('CONTACT_EMAIL', undefined)
        
        vi.mocked(stockNotificationEmailTemplate).mockReturnValue('<html>Template</html>')
        mockResendSend.mockRejectedValue(new Error('Missing recipient email'))

        const result = await receiveStockNotificationEmail(mockProductNotificationData as NotificationWithDetails)

        expect(result).toEqual({
            success: false,
            error: STOCK_SEND_FAILED
        })
    })

    // RESEND_REVIEW_NOTIFICATION_API_KEY が未設定の場合）
    it('should handle missing RESEND_STOCK_NOTIFICATION_API_KEY environment variable', async () => {
        vi.stubEnv('RESEND_STOCK_NOTIFICATION_API_KEY', undefined)
        
        vi.mocked(stockNotificationEmailTemplate).mockReturnValue('<html>Template</html>')
        mockResendSend.mockRejectedValue(new Error('Missing API key'))

        const result = await receiveStockNotificationEmail(mockProductNotificationData as NotificationWithDetails)

        expect(result).toEqual({
            success: false,
            error: STOCK_SEND_FAILED
        })
    })

    // 送信失敗（record が null）
    it('should return error when record is null', async () => {
        const result = await receiveStockNotificationEmail(null as unknown as NotificationWithDetails)

        expect(result).toEqual({
            success: false,
            error: STOCK_SEND_FAILED
        })
    })
})