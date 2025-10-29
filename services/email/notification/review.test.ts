import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { receiveReviewNotificationEmail } from "@/services/email/notification/review"
import { reviewNotificationEmailTemplate } from "@/lib/templates/email/notification"
import { mockReview } from "@/__tests__/mocks/domain-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { EMAIL_ERROR } = ERROR_MESSAGES;

const { REVIEW_SEND_FAILED } = EMAIL_ERROR;

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
    reviewNotificationEmailTemplate: vi.fn()
}))

/* ==================================== 
    receiveReviewNotificationEmail Test
==================================== */
describe('receiveReviewNotificationEmail', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        vi.stubEnv('RESEND_REVIEW_NOTIFICATION_API_KEY', 'test-api-key')
        vi.stubEnv('CONTACT_EMAIL', 'contact@example.com')
    })

    afterEach(() => {
        vi.unstubAllEnvs()
    })

    // 送信成功
    it('should send review notification email successfully', async () => {
        const mockHtml = '<html>Chat notification email template</html>'
        vi.mocked(reviewNotificationEmailTemplate).mockReturnValue(mockHtml)
        mockResendSend.mockResolvedValue({ id: 'email-123' })

        const result = await receiveReviewNotificationEmail(mockReview as Review)

        expect(result).toEqual({
            success: true,
            error: undefined
        })
        
        expect(reviewNotificationEmailTemplate).toHaveBeenCalledWith(mockReview)
        
        expect(mockResendSend).toHaveBeenCalledWith({
            from: 'notification@skill-sync.site',
            to: ['contact@example.com'],
            subject: '【Skill Sync】のサイトにレビューが投稿されました',
            html: mockHtml
        })
    })

    // 送信失敗（Resend 送信エラー）
    it('should handle Resend send error', async () => {
        vi.mocked(reviewNotificationEmailTemplate).mockReturnValue('<html>Template</html>')
        mockResendSend.mockRejectedValue(new Error('Resend API error'))

        const result = await receiveReviewNotificationEmail(mockReview as Review)

        expect(result).toEqual({
            success: false,
            error: REVIEW_SEND_FAILED
        })
    })

    // 送信失敗（テンプレート関数内でエラー）
    it('should handle template function error', async () => {
        vi.mocked(reviewNotificationEmailTemplate).mockImplementation(() => {
            throw new Error('Template error')
        })

        const result = await receiveReviewNotificationEmail(mockReview as Review)

        expect(result).toEqual({
            success: false,
            error: REVIEW_SEND_FAILED
        })
        expect(mockResendSend).not.toHaveBeenCalled()
    })

    // 送信失敗（CONTACT_EMAIL が未設定の場合）
    it('should handle missing CONTACT_EMAIL environment variable', async () => {
        vi.stubEnv('CONTACT_EMAIL', undefined)
        
        vi.mocked(reviewNotificationEmailTemplate).mockReturnValue('<html>Template</html>')
        mockResendSend.mockRejectedValue(new Error('Missing recipient email'))

        const result = await receiveReviewNotificationEmail(mockReview as Review)

        expect(result).toEqual({
            success: false,
            error: REVIEW_SEND_FAILED
        })
    })

    // RESEND_REVIEW_NOTIFICATION_API_KEY が未設定の場合）
    it('should handle missing RESEND_REVIEW_NOTIFICATION_API_KEY environment variable', async () => {
        vi.stubEnv('RESEND_REVIEW_NOTIFICATION_API_KEY', undefined)
        
        vi.mocked(reviewNotificationEmailTemplate).mockReturnValue('<html>Template</html>')
        mockResendSend.mockRejectedValue(new Error('Missing API key'))

        const result = await receiveReviewNotificationEmail(mockReview as Review)

        expect(result).toEqual({
            success: false,
            error: REVIEW_SEND_FAILED
        })
    })

    // 送信失敗（record が null）
    it('should return error when record is null', async () => {
        const result = await receiveReviewNotificationEmail(null as unknown as Review)

        expect(result).toEqual({
            success: false,
            error: REVIEW_SEND_FAILED
        })
    })
})