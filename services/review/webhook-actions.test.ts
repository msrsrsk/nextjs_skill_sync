import { describe, it, expect, vi, beforeEach } from "vitest"

import { processReviewWebhook } from "@/services/review/webhook-actions"
import { receiveReviewNotificationEmail } from "@/services/email/notification/review"
import { deleteReviewImage } from "@/services/cloudflare/actions"
import { mockReview } from "@/__tests__/mocks/domain-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { REVIEW_ERROR, EMAIL_ERROR, CLOUDFLARE_ERROR } = ERROR_MESSAGES;
const { WEBHOOK_INSERT_FAILED, WEBHOOK_DELETE_FAILED, WEBHOOK_PROCESS_FAILED } = REVIEW_ERROR;
const { REVIEW_SEND_FAILED } = EMAIL_ERROR;
const { DELETE_FAILED } = CLOUDFLARE_ERROR;

vi.mock('@/services/email/notification/review', () => ({
    receiveReviewNotificationEmail: vi.fn()
}))

vi.mock('@/services/cloudflare/actions', () => ({
    deleteReviewImage: vi.fn()
}))

/* ==================================== 
    Process Review Webhook Test
==================================== */
describe('processReviewWebhook', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 処理成功（INSERT 成功）
    it('should process review webhook successfully with insert', async () => {
        const mockReceiveReviewNotificationEmail = vi.mocked(receiveReviewNotificationEmail)

        mockReceiveReviewNotificationEmail.mockResolvedValue({
            success: true,
            error: undefined
        })

        const result = await processReviewWebhook({
            record: mockReview as Review,
            type: 'INSERT'
        })

        expect(result.success).toBe(true)
        expect(mockReceiveReviewNotificationEmail).toHaveBeenCalledWith(mockReview)
    })

    // 処理失敗（INSERT record が undefined）
    it('should process review webhook failed with record is undefined', async () => {
        const result = await processReviewWebhook({
            record: undefined,
            type: 'INSERT'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(WEBHOOK_INSERT_FAILED)
    })

    // 処理失敗（INSERT record が null）
    it('should process review webhook failed with record is null', async () => {
        const result = await processReviewWebhook({
            record: null as unknown as Review,
            type: 'INSERT'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(WEBHOOK_INSERT_FAILED)
    })

    // 処理失敗（INSERT 通知メールの送信失敗）
    it('should process review webhook failed with receive review notification email failed', async () => {
        const mockReceiveReviewNotificationEmail = vi.mocked(receiveReviewNotificationEmail)

        mockReceiveReviewNotificationEmail.mockResolvedValue({
            success: false,
            error: REVIEW_SEND_FAILED
        })

        const result = await processReviewWebhook({
            record: mockReview as Review,
            type: 'INSERT'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(REVIEW_SEND_FAILED)
    })

    // 処理失敗（type が undefined）
    it('should process review webhook failed with type is undefined', async () => {
        const result = await processReviewWebhook({})
        
        expect(result.success).toBe(false)
        expect(result.error).toBe(WEBHOOK_PROCESS_FAILED)
    })

    // 処理失敗（INSERT 例外発生）
    it('should handle email service throwing error', async () => {
        const mockReceiveReviewNotificationEmail = vi.mocked(receiveReviewNotificationEmail)

        mockReceiveReviewNotificationEmail.mockRejectedValue(
            new Error('Email service unavailable')
        )

        await expect(processReviewWebhook({
            record: mockReview as Review,
            type: 'INSERT'
        })).rejects.toThrow('Email service unavailable')
    })

    // 処理成功（DELETE 成功）
    it('should process review webhook successfully with delete', async () => {
        const mockDeleteReviewImage = vi.mocked(deleteReviewImage)

        mockDeleteReviewImage.mockResolvedValue({
            success: true,
            error: undefined
        })

        const result = await processReviewWebhook({
            old_record: mockReview as Review,
            type: 'DELETE'
        })

        expect(result.success).toBe(true)
        expect(mockDeleteReviewImage).toHaveBeenCalledWith(mockReview)
    })

    // 処理失敗（DELETE old_record が undefined）
    it('should process review webhook failed with old_record is undefined', async () => {
        const result = await processReviewWebhook({
            old_record: undefined,
            type: 'DELETE'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(WEBHOOK_DELETE_FAILED)
    })

    // 処理失敗（DELETE old_record が null）
    it('should process review webhook failed with old_record is null', async () => {
        const result = await processReviewWebhook({
            old_record: null as unknown as Review,
            type: 'DELETE'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(WEBHOOK_DELETE_FAILED)
    })

    // 処理失敗（DELETE 画像の削除失敗）
    it('should process review webhook failed with delete review image failed', async () => {
        const mockDeleteReviewImage = vi.mocked(deleteReviewImage)

        mockDeleteReviewImage.mockResolvedValue({
            success: false,
            error: DELETE_FAILED
        })

        const result = await processReviewWebhook({
            old_record: mockReview as Review,
            type: 'DELETE'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_FAILED)
    })

    // 処理失敗（DELETE type が undefined）
    it('should process review webhook failed with type is undefined', async () => {
        const result = await processReviewWebhook({
            old_record: mockReview as Review,
            type: undefined
        })
        
        expect(result.success).toBe(false)
        expect(result.error).toBe(WEBHOOK_PROCESS_FAILED)
    })

    // 処理失敗（DELETE 例外発生）
    it('should handle delete review image throwing error', async () => {
        const mockDeleteReviewImage = vi.mocked(deleteReviewImage)

        mockDeleteReviewImage.mockRejectedValue(
            new Error('Delete review image failed')
        )

        await expect(processReviewWebhook({
            old_record: mockReview as Review,
            type: 'DELETE'
        })).rejects.toThrow('Delete review image failed')
    })

    // 処理失敗（デフォルトケース）
    it('should process review webhook failed with unknown type', async () => {
        const result = await processReviewWebhook({
            type: 'UNKNOWN'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(WEBHOOK_PROCESS_FAILED)
    })
})